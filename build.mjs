import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

const revision = process.env.COMMIT_REF?.slice(0, 12)
  || execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], { encoding: 'utf8' }).trim();

await build({
  entryPoints: ['src/mac/main.jsx'],
  bundle: true,
  format: 'esm',
  minify: true,
  outfile: 'dist/main.js',
  jsx: 'automatic',
  external: ['assets/*'],
});

const indexPath = 'dist/index.html';
const index = await readFile(indexPath, 'utf8');
await writeFile(indexPath, index
  .replace('href="main.css"', `href="main.css?v=${revision}"`)
  .replace('src="main.js"', `src="main.js?v=${revision}"`));
