/**
 * Importing npm packages.
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

/**
 * Importing user defined packages.
 */

/**
 * Declaring the constants.
 */
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const packageJson = require('../package.json');

/**
 * The root package.json is marked as private to prevent publishing from
 * happening in the root of the project. This sets the package back to public
 * so it can be published from the "dist" directory.
 */
packageJson.private = false;

/** Remove package.json items that we don't need to publish */
delete packageJson.scripts;
delete packageJson.engines;

/**
 * The root package.json points to the CJS/ESM source in 'dist', to support
 * on-going package development. When publishing from 'dist' however, we need
 * to update the package.json to point to the files within the same directory.
 */
const distPackageJson = JSON.stringify(
  packageJson,
  (_key, value) => {
    if (typeof value !== 'string' || !value.startsWith('./dist/')) return value;
    const parts = value.split('/');
    parts.splice(1, 1);
    return parts.join('/');
  },
  2,
);

/** Save the modified package.json to 'dist' */
fs.writeFileSync(`${distDir}/package.json`, distPackageJson);

/** Copy supporting files into 'dist' */
fs.copyFileSync(`${rootDir}/README.md`, `${distDir}/README.md`);
fs.copyFileSync(`${rootDir}/LICENSE`, `${distDir}/LICENSE`);

/** Build for commmonJS */
esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: './dist/index.cjs',
  format: 'cjs',
  target: 'es2020',
  outExtension: { '.js': '.cjs' },
});
