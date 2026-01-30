# Project Health Atlas Roadmap — Proof Bundles & Decision Auditability

**Purpose.** Extend the existing **Project Health Atlas** app into a self‑contained governance surface where every model‑driven decision carries portable evidence (a “proof bundle”) and users can read *why* a tile looks the way it does without leaving the map.

**Primary app target:** `web_apps/Project_Health_Atlas.html`

---

## 1) Concept: Proof Bundles (drop‑in spec)

**Definition.** A proof bundle is an automatically assembled pack of acceptance artifacts, rule receipts, and lineage maps emitted after each model‑driven decision. Think of it as **auditability as a design language**: every decision ships with portable evidence, readable by humans and machines.

### What it is (plain terms)
- **Acceptance artifact:** the concrete thing that proves the decision met its acceptance criteria (e.g., eval run, screenshot, signed checksum, notebook cell output).
- **Rule receipt:** a small, immutable record of which rules fired (prompts, filters, thresholds, policy IDs, date windows).
- **Lineage map:** a trace from inputs → transforms → models → outputs (hashes and versions, not just names), so you can replay or refute any step.

### Why it helps
- **Trust‑by‑default:** each decision is shippable with its own proof, no scavenger hunt later.
- **Rapid challenge/defense:** stakeholders can say “show me” and get a self‑contained bundle.
- **Reuse:** the same format works for PMO boards, risk reviews, CFO packs, or audit trails.

### Minimal spec (drop‑in, versioned)

```yaml
proof_bundle:
  version: 0.2
  decision:
    id: "dec_2026-01-06_1542Z_foo123"
    timestamp_utc: "2026-01-06T15:42:07Z"
    actor: { type: "agent", name: "Allocator-β", role: "DecisionMaker" }
    intent: "Prioritize work-package WP-17 for next sprint"
  inputs:
    artefacts:
      - { kind: "dataset", name: "risk_register.csv", sha256: "<...>", uri: "s3://..." }
      - { kind: "prompt", name: "ranking_prompt_v5", sha256: "<...>" }
    context:
      - { key: "date_window", value: "90d" }
      - { key: "risk_tag", value: "interface:red" }
  processing:
    transforms:
      - { name: "CleanNulls", ver: "1.3.1", sha256: "<...>" }
      - { name: "GraphExpandInterfaces", ver: "0.9.0", sha256: "<...>" }
    models:
      - { name: "Llama-X", ver: "8.2", weights_sha256: "<...>", temperature: 0.2 }
  outputs:
    result:
      summary: "WP-17 elevated due to upstream hazard with no approved mitigation."
      decision: "promote"
    artefacts:
      - { kind: "table", name: "ranked_backlog.parquet", sha256: "<...>" }
  acceptance_artifacts:
    checks:
      - { name: "PolicyConformance:RiskEscalation", status: "pass", evidence_uri: "./evidence/policy_receipt.json" }
      - { name: "Eval:StabilityAcrossSeeds", status: "pass", kpi: { var_delta: 0.03 } }
  rule_receipts:
    ruleset_id: "rules/pmo_v3.yaml#R12,R18"
    fired:
      - { id: "R12", text: "Escalate items with red hazard lacking owner within 90d" }
      - { id: "R18", text: "Boost items blocking ≥2 milestones" }
    non_fired:
      - { id: "R07", reason: "date_window_miss" }
  lineage_map:
    graph:
      nodes:
        - { id: "risk_register.csv", type: "input" }
        - { id: "CleanNulls@1.3.1", type: "transform" }
        - { id: "GraphExpandInterfaces@0.9.0", type: "transform" }
        - { id: "Llama-X@8.2", type: "model" }
        - { id: "ranked_backlog.parquet", type: "output" }
      edges:
        - { from: "risk_register.csv", to: "CleanNulls@1.3.1" }
        - { from: "CleanNulls@1.3.1", to: "GraphExpandInterfaces@0.9.0" }
        - { from: "GraphExpandInterfaces@0.9.0", to: "Llama-X@8.2" }
        - { from: "Llama-X@8.2", to: "ranked_backlog.parquet" }
  signatures:
    bundle_sha256: "<overall-hash>"
    signers:
      - { by: "Allocator-β", method: "ed25519", sig: "<...>" }
```

### File layout (ready for your repos)

```
/proof-bundles/
  dec_2026-01-06_1542Z_foo123/
    proof_bundle.yaml
    evidence/
      policy_receipt.json
      eval_report.md
      plots/
        stability.png
    artefacts/
      ranked_backlog.parquet
    lineage/
      lineage.graphml
      lineage.mmd            # Mermaid as text for boards
    receipts/
      rules_fired.ndjson
```

### Emitters (how to generate it on every run)
- **Before decision:** capture inputs (URIs + hashes) and config.
- **During:** wrap transforms/models with a decorator that logs versions + params and writes a lineage edge.
- **After:** compute acceptance checks, write receipts, sign bundle, and upload.

### Two immediate uses in your world
- **SharpCloud “rule‑driven views”:** attach the bundle so each board tile links to its lineage and receipts (no hand‑curation).
- **PMO/Risk governance:** monthly “proof‑rollup” that concatenates receipts across decisions to show coverage (what rules are actually shaping things).

---

## 2) Atlas‑specific goals

1. **Make the atlas explainable at a glance.** Every tile can answer: *What’s the gap? Why is it tilted? Which rules fired?*.
2. **Make decisions portable.** Clicking a decision emits a proof bundle that can be stored, emailed, or attached to a PMO board tile.
3. **Avoid UI overload.** Keep the existing visual map clean and push heavy audit artifacts into a dedicated secondary tab.

---

## 3) Current app baseline (assumed)

The current Project Health Atlas provides:
- A tile grid where **Capability**, **Maturity**, and **Performance** gaps deform tiles.
- Mini‑DAG visuals to hint where flow bottlenecks occur.
- “What / Why / How” explainer buttons and per‑tile info popovers.
- Tour overlays and randomization controls for demonstration.

This roadmap assumes those stay intact and are used as the front‑door visual summary.

---

## 4) Roadmap phases (exhaustive and implementation‑ready)

### Phase A — Proof Bundle data model + storage
**Objective:** Add a canonical bundle schema + storage structure, without changing the visual atlas UI.

**Deliverables**
1. **Bundle schema** as defined above (versioned YAML + JSON export).
2. **Atlas decision record** stored per tile click, including tile id, gap values, rule receipts, and links to evidence.
3. **Local file layout** matching the proof‑bundles folder pattern (single decision per folder).

**Acceptance criteria**
- Generating a bundle requires no UI changes: a simple button or API call can export the bundle for a selected tile.
- Bundles validate against the schema and include hashes for each evidence file.

### Phase B — Rules + receipts (deterministic “why”)
**Objective:** Make every tile’s gap score and tilt deterministically explainable via a **ruleset**.

**Deliverables**
1. **Ruleset registry:** a small YAML describing rules for tile scoring (thresholds, time windows, policy IDs).
2. **Receipt format:** JSON/NDJSON entry containing: rule id, fired true/false, inputs used, and computed deltas.
3. **Deterministic scoring function:** take raw inputs, apply rules, output gap vector + receipts.

**Acceptance criteria**
- Selecting a tile yields a list of fired/non‑fired rules and their inputs.
- “Why” explainer references the same receipt output (no duplicate logic).

### Phase C — Lineage tracking for atlas inputs
**Objective:** Provide provenance for every input used to generate the map.

**Deliverables**
1. **Input manifest**: for each dataset/prompt/config used, store URI + sha256.
2. **Transform list**: each data transform includes name, version, hash, and parameters.
3. **Lineage graph output**: GraphML and Mermaid output for board attachments.

**Acceptance criteria**
- Any tile can show its lineage map (inputs → transforms → outputs).
- Map can be attached to a governance board without custom rendering.

### Phase D — UI enhancements (explainers + proof bundle access)
**Objective:** Keep the atlas clean, while enabling drill‑downs to proof bundles.

**Deliverables**
1. **Tile “Proof Bundle” button** inside the tile modal: exports/opens the bundle folder.
2. **Explainer enhancements** (full text below) which explicitly mention receipts and lineage.
3. **Evidence badges** on tiles: a small icon indicating a complete bundle is available.

**Acceptance criteria**
- Every tile click offers a one‑tap “Download proof bundle”.
- Explainer text references the same rules and lineage sources used in computation.

### Phase E — Governance workflows (roll‑ups)
**Objective:** Allow monthly or board‑level roll‑ups across multiple tiles.

**Deliverables**
1. **Proof roll‑up generator**: merge receipts across multiple decisions to see rule coverage.
2. **Atlas export**: CSV/NDJSON of tiles + their bundle IDs.
3. **Portfolio view**: simple list of tiles with last decision timestamp + evidence status.

**Acceptance criteria**
- A governance viewer can filter tiles by rule coverage or evidence completeness.
- Roll‑up output is human readable (summary) + machine readable (NDJSON).

---

## 5) UI additions and explainer text (ready‑to‑paste copy)

### Primary “What / Why / How” buttons

**What (button copy)**
> “This atlas is a live map of project health. Each tile represents a work package. The three bars show capability, maturity, and performance gaps (0–100). The tile tilts toward the biggest gap, and the mini‑DAG highlights where flow is blocked.”

**Why (button copy)**
> “We use tiles because they make tradeoffs visible at a glance. Every tilt is computed from explicit rules, and every decision is packaged with receipts and lineage. If a stakeholder asks ‘why does this tile look red?’, the map has a verifiable answer.”

**How (button copy)**
> “Each tile is scored by a deterministic ruleset. Scores feed the deformation engine; receipts record which rules fired, and lineage links the data inputs and transforms. A proof bundle is generated on demand so you can share the decision evidence.”

### Tile info popover text (ⓘ button)

**Tile “Why this tile?”**
> “This tile leans toward its dominant gap. Click ‘Receipts’ to see the rules that fired, and ‘Lineage’ to see which inputs and transforms shaped the score.”

### New “Proof Bundle” button (modal)

**Button label:** `Proof Bundle`  
**Tooltip:** “Download a portable evidence pack (receipts + lineage + acceptance artifacts).”

### New “Receipts” button (modal)

**Button label:** `Receipts`  
**Tooltip:** “Show the ruleset decisions behind this score.”

### New “Lineage” button (modal)

**Button label:** `Lineage`  
**Tooltip:** “Trace inputs → transforms → model outputs for this tile.”

---

## 6) Proposed second tab (to avoid UI overload)

### Tab name: **Proof Bundles & Governance**

**Purpose:** keep audit artifacts out of the visual map while making them easy to review for governance.

**Layout proposals**
1. **Bundle browser table**
   - Columns: decision id, tile id, timestamp, rule coverage, evidence completeness, signer.
   - Filters: by ruleset id, by missing evidence, by date window.
2. **Bundle detail drawer**
   - Shows decision summary, rule receipts, acceptance checks, lineage preview.
   - Links to download evidence folder or view Mermaid lineage.
3. **Roll‑up dashboard**
   - Metrics: % tiles with complete bundles, top 5 rules firing most often, anomalies.
   - One‑click export to NDJSON or CSV.

**Acceptance criteria**
- Users can find and export a proof bundle without leaving the atlas.
- Governance review can happen entirely in this tab without cluttering the main tile grid.

---

## 7) Compatibility notes (what to exclude from the Project Health Atlas)

These features are **not compatible** with the Project Health Atlas and should remain out of scope:
1. **Real‑time BIM/IFC ingestion in the browser.** Too heavy for the atlas UI; keep as offline preprocessing.
2. **Full‑fidelity scheduling engines (CPM/Monte Carlo) inside the map.** The atlas is a summary surface, not the primary scheduler.
3. **Live multi‑user editing of the same tile grid.** Requires collaborative conflict resolution beyond the atlas scope.
4. **3D geometry viewers or digital twin rendering.** Visual complexity conflicts with the atlas’ lightweight, executive‑friendly presentation.
5. **Vendor‑locked rule engines embedded in core logic.** Rules should remain portable and auditable across toolchains.

---

## 8) Data inputs & integration expectations

**Input datasets (minimum)**
- Work package registry (id, owner, phase, criticality).
- Capability/maturity/performance metrics (numeric scores + timestamp).
- Risk register or hazard flags (to explain spikes or red tiles).

**Integration points**
- Export tile states + bundle ids to SharpCloud or PMO dashboards.
- Import rulesets and thresholds from YAML in a repo to keep change tracking auditable.

---

## 9) Definition of done (high confidence)

A build is “done” when:
- Every tile can generate a proof bundle with acceptance artifacts, rule receipts, and lineage map.
- The Proof Bundles & Governance tab can search and export bundles.
- The explainer copy is consistent with the ruleset and receipts (single source of truth).
- Governance roll‑ups show rule coverage and evidence completeness across the atlas.

---

## 10) Quick‑start checklist (for implementers with only the atlas app)

1. **Clone the existing atlas HTML** and add a new tab container for “Proof Bundles & Governance.”
2. **Add a small ruleset file** in YAML that maps inputs → gap scores.
3. **Wire a deterministic scoring function** that returns scores + receipts.
4. **Generate a bundle object** that follows the schema above, writing to `/proof-bundles/<decision-id>/`.
5. **Expose buttons** (Proof Bundle / Receipts / Lineage) in the tile modal.
6. **Render bundle browser table** in the second tab.
7. **Add exports** for NDJSON + CSV.

---

## 11) Roadmap owners & checkpoints

- **Owner:** Project Health Atlas product lead.
- **Checkpoint 1:** Proof bundle schema + example bundle output.
- **Checkpoint 2:** Receipts appear for every tile.
- **Checkpoint 3:** Lineage map export works.
- **Checkpoint 4:** Governance tab supports roll‑ups.

---

## 12) Example proof bundle (atlas‑specific decision)

**Decision example:** “Reclassify Tile PH‑014 as *Performance‑critical* due to red hazard + late mitigation.”
- **Rule receipts:** fired `R-Perf-07` (late mitigation window), `R-Risk-02` (hazard severity > threshold).
- **Acceptance artifacts:** screenshot of tile before/after, policy receipt JSON, model eval summary.
- **Lineage:** risk register v12 → CleanNulls@1.3.1 → AtlasScore@0.4.0 → tile state.

