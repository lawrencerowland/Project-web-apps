import { accessSync, constants, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

accessSync(new URL('./index.html', import.meta.url), constants.F_OK);
console.log('index.html exists');
for (const file of readdirSync(new URL('./tests/', import.meta.url)).filter(name => name.endsWith('.cjs')).sort()) {
  const result = spawnSync(process.execPath, [new URL(`./tests/${file}`, import.meta.url).pathname], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
