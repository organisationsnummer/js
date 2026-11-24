import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { build } from 'esbuild';

const run = (command, args) => {
  const { status, error } = spawnSync(command, args, { stdio: 'inherit' });
  if (error) throw error;
  if (status !== 0) process.exit(status ?? 1);
};

const buildOptions = (format) => ({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format,
  outfile: `./dist/${format}/index.js`,
  // Keep `require('organisationsnummer')` returning the class, not `{ default }`.
  ...(format === 'cjs' && {
    footer: { js: 'module.exports = module.exports.default;' },
  }),
});

rmSync('./dist', { recursive: true, force: true });

console.log('Building types');
run('tsc', ['--emitDeclarationOnly']);

console.log('Building cjs');
await build(buildOptions('cjs'));

console.log('Building esm');
await build(buildOptions('esm'));
