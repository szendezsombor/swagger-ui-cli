import {build} from 'esbuild';

await build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  minify: true,
  outfile: 'dist/index.js',
  format: 'esm',
  platform: 'node',
  target: 'node18',
  packages: 'external',
  sourcemap: true,
  tsconfig: './tsconfig.app.json',
});
