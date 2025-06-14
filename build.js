const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const jsxDir = path.join(__dirname, 'jsx_apps');
const tsxDir = path.join(__dirname, 'tsx_apps');
const outDir = path.join(__dirname, 'web_apps', 'dist');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const collectEntries = dir =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx')).map(f => path.join(dir, f))
    : [];

const entries = [...collectEntries(jsxDir), ...collectEntries(tsxDir)];

entries.forEach(entry => {
  const outfile = path.join(outDir, path.basename(entry, path.extname(entry)) + '.js');
  esbuild.buildSync({
    entryPoints: [entry],
    outfile,
    bundle: true,
    format: 'iife',
    loader: { '.js': 'jsx', '.jsx': 'jsx', '.ts': 'ts', '.tsx': 'tsx' }
  });
  console.log('Built', outfile);
});
