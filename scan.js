import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import fetch from "node-fetch";
import pLimit from "p-limit";

const GH_TOKEN = process.env.GITHUB_TOKEN;
const CONCURRENCY = 10;
const limit = pLimit(CONCURRENCY);
const MAX_REDIRECTS = 5;

function uniqueHosts(urls) {
  const set = new Set();
  for (const u of urls) {
    try {
      set.add(new URL(u).host);
    } catch {
      // ignore invalid URL
    }
  }
  return [...set];
}

async function readAppIndexCsv(path = "app-index.csv") {
  const txt = await fs.readFile(path, "utf8");
  return parse(txt, { columns: true, skip_empty_lines: true });
}

async function harvestFromJsonLd(html) {
  const urls = [];
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const obj = JSON.parse(m[1]);
      const items = Array.isArray(obj) ? obj : [obj];
      for (const it of items) {
        if (it.url) urls.push(it.url);
        if (Array.isArray(it.sameAs)) urls.push(...it.sameAs);
      }
    } catch {
      // ignore malformed JSON-LD
    }
  }
  return urls;
}

async function fetchHeadOrRange(u) {
  const started = Date.now();
  try {
    const res = await fetch(u, { method: "HEAD", redirect: "manual" });
    if (res.status === 405 || res.status === 0) {
      const rangeRes = await fetch(u, {
        method: "GET",
        redirect: "manual",
        headers: { Range: "bytes=0-0" },
      });
      return { res: rangeRes, latency: Date.now() - started, usedFallback: true };
    }
    return { res, latency: Date.now() - started, usedFallback: false };
  } catch {
    try {
      const res = await fetch(u, {
        method: "GET",
        redirect: "manual",
        headers: { Range: "bytes=0-0" },
      });
      return { res, latency: Date.now() - started, usedFallback: true };
    } catch {
      return { res: null, latency: Date.now() - started, usedFallback: true };
    }
  }
}

async function headOnce(u) {
  let current = u;
  let redirects = 0;
  let lastRes = null;
  let latency = 0;

  while (redirects <= MAX_REDIRECTS) {
    const { res, latency: stepLatency } = await fetchHeadOrRange(current);
    latency += stepLatency;
    lastRes = res;

    if (!res) {
      return {
        url: current,
        status: 0,
        contentType: "",
        latency,
        redirects,
      };
    }

    const status = res.status;
    if (status >= 300 && status < 400 && res.headers.get("location")) {
      const next = res.headers.get("location");
      try {
        current = new URL(next, current).toString();
      } catch {
        break;
      }
      redirects += 1;
      continue;
    }

    return {
      url: current,
      status,
      contentType: res.headers.get("content-type") || "",
      latency,
      redirects,
    };
  }

  return {
    url: current,
    status: lastRes ? lastRes.status : 0,
    contentType: lastRes ? lastRes.headers.get("content-type") || "" : "",
    latency,
    redirects,
  };
}

function tallyHost(agg, host, status, latency) {
  const now = new Date().toISOString();
  const a =
    agg.get(host) ||
    {
      host,
      last_checked: now,
      ok: 0,
      redirects: 0,
      client_errors: 0,
      server_errors: 0,
      latencies: [],
    };
  a.last_checked = now;
  if (status >= 200 && status < 300) a.ok += 1;
  else if (status >= 300 && status < 400) a.redirects += 1;
  else if (status >= 400 && status < 500) a.client_errors += 1;
  else if (status >= 500) a.server_errors += 1;
  a.latencies.push(latency);
  agg.set(host, a);
}

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const i = Math.floor(s.length / 2);
  return s.length ? (s.length % 2 ? s[i] : (s[i - 1] + s[i]) / 2) : 0;
}

async function githubReposForOwner(owner) {
  if (!GH_TOKEN) return [];
  const out = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${GH_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    if (!res.ok) break;
    const data = await res.json();
    out.push(
      ...data.map((r) => ({
        owner: r.owner.login,
        repo: r.name,
        default_branch: r.default_branch,
        updated_at: r.updated_at,
        pushed_at: r.pushed_at,
        is_archived: r.archived,
      }))
    );
    if (data.length < 100) break;
    page += 1;
  }
  return out;
}

async function main() {
  const started_at = new Date().toISOString();
  const rows = await readAppIndexCsv();

  const initialUrls = rows.map((r) => r.url).filter(Boolean);
  const extraUrls = [];
  for (const u of initialUrls.slice(0, 20)) {
    try {
      const res = await fetch(u, { method: "GET" });
      if (res.ok) extraUrls.push(...(await harvestFromJsonLd(await res.text())));
    } catch {
      // ignore fetch errors
    }
  }
  const allUrls = [...new Set([...initialUrls, ...extraUrls])];
  const hosts = uniqueHosts(allUrls);

  const headTargets = hosts.map((h) => `https://${h}/`);
  const agg = new Map();
  const dead = [];

  await Promise.all(
    headTargets.map((u) =>
      limit(async () => {
        const r = await headOnce(u);
        const host = new URL(u).host;
        tallyHost(agg, host, r.status, r.latency);
        if (r.status === 404 || r.status === 410) {
          dead.push({
            host,
            url: u,
            status: r.status,
            first_seen: started_at,
            last_seen: started_at,
          });
        }
      })
    )
  );

  const owners = [
    ...new Set(
      rows
        .map((r) => (r.repo || "").split("/")[0])
        .filter(Boolean)
    ),
  ];

  const repoLists = (await Promise.all(owners.map((o) => githubReposForOwner(o))))
    .flat()
    .sort((a, b) => a.owner.localeCompare(b.owner) || a.repo.localeCompare(b.repo));

  const hostsAggRows = [...agg.values()].map((a) => ({
    host: a.host,
    last_checked: a.last_checked,
    ok: a.ok,
    redirects: a.redirects,
    client_errors: a.client_errors,
    server_errors: a.server_errors,
    median_latency_ms: Math.round(median(a.latencies)),
  }));

  const summary = {
    run_id: started_at.replace(/[:.]/g, "-"),
    started_at,
    finished_at: new Date().toISOString(),
    total_hosts: hostsAggRows.length,
    ok: hostsAggRows.reduce((s, x) => s + x.ok, 0),
    redirects: hostsAggRows.reduce((s, x) => s + x.redirects, 0),
    client_errors: hostsAggRows.reduce((s, x) => s + x.client_errors, 0),
    server_errors: hostsAggRows.reduce((s, x) => s + x.server_errors, 0),
  };

  await fs.mkdir("out", { recursive: true });
  await fs.writeFile("out/scan_summary.json", JSON.stringify(summary, null, 2));
  await fs.writeFile(
    "out/hosts_aggregate.csv",
    stringify(hostsAggRows, { header: true })
  );
  await fs.writeFile("out/dead_links.csv", stringify(dead, { header: true }));
  await fs.writeFile("out/repos.csv", stringify(repoLists, { header: true }));

  console.log("Done:", summary);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
