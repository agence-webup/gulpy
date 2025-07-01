# Gulpy

A modern Gulp wrapper for streamlined build processes.

## Install

```shell
npm i -D @agence-webup/gulpy
```

**Requirements:**

- Node.js 14+ (for ESM support)
- Gulp 4.x

## Quick Start

### ESM (Recommended - v3.x)

```js
import gulp from 'gulp'
import Gulpy from '../src/index.js'

// config
const gulpy = new Gulpy({
  publicFolder: 'dist',
  manifest: 'dist/rev-manifest.json',
  npmManifest: 'dist/npm-manifest.json',
  mozjpeg: {
    progressive: true,
    quality: 80,
  },
  babelPresetEnv: {
    modules: false,
  },
})

// tasks
const sass = gulpy.sass('src/sass/style.scss', 'dist/css')
const less = gulpy.less('src/less/style2.less', 'dist/css')
const js = gulpy.js(['src/js/**/*.js', '!src/js/*.js'], 'dist/js')
const bundle = gulpy.bundle('src/js/*.js', 'dist/js', 'bundle.js')
const images = gulpy.images('src/img/**/*', 'dist/img')
const copy = gulp.parallel(
  gulpy.copy('src/fonts/**/*', 'dist/fonts'),
  gulpy.copy('src/**/*.html', 'dist')
)
const copyNpm = gulpy.copyNpm('dist/node_modules')
const version = gulpy.version([
  'dist/**',
  '!dist/node_modules/**',
  '!**/*.html',
])
const replaceVersion = gulpy.replaceVersion('dist/**/*.{css,html}', 'dist')
const npmVersion = gulpy.npmVersion()
const clean = gulpy.clean(['dist/**'])
const command = gulpy.exec('echo "custom command"')

gulpy.addWatch(
  ['src/html/folder1/**/*', 'src/html/folder2/**/*'],
  {
    delay: 500,
  },
  command
)

// export
const buildTask = gulp.series(
  clean,
  gulp.series(sass, less, js, bundle, images, copy, copyNpm, command)
)

let defaultTask = buildTask
if (gulpy.isProduction()) {
  defaultTask = gulp.series(buildTask, version, replaceVersion, npmVersion)
}

export default defaultTask
export const watch = gulpy.watch()
```

## Migration Guide

### Upgrading from v2.x to v3.x

Update your gulpfile.js to use ESM imports:

**Before (v2.x):**

```js
const gulp = require('gulp')
const Gulpy = require('@agence-webup/gulpy')

// ... your tasks

exports.default = gulp.series(/* your tasks */)
exports.watch = gulpy.watch()
```

**After (v3.x):**

```js
import gulp from 'gulp'
import Gulpy from '@agence-webup/gulpy'

// ... your tasks

const buildTask = gulp.series(/* your tasks */)
let defaultTask = buildTask

if (gulpy.isProduction()) {
  defaultTask = gulp.series(buildTask, version, replaceVersion, npmVersion)
}

export default defaultTask
export const watch = gulpy.watch()
```

## API Reference

### Methods

- `sass(src, dist)` - Compile Sass files
- `less(src, dist)` - Compile Less files
- `js(src, dist)` - Process JavaScript files
- `bundle(src, dist, filename)` - Bundle JavaScript files
- `images(src, dist)` - Optimize images
- `clean(dist)` - Clean directories
- `copy(src, dist)` - Copy files
- `copyNpm(dist)` - Copy npm dependencies
- `version(src)` - Add cache-busting hashes to files
- `replaceVersion(src, dist)` - Replace filenames using cache manifest
- `npmVersion()` - Generate cache manifest for node_modules
- `watch()` - Auto watch all configured tasks
- `clearCache()` - Clear the cache (mainly used for images)
- `isProduction()` - Return true if --production or --prod flag is used

`src` and `dist` can be glob strings (https://gulpjs.com/docs/en/getting-started/explaining-globs)

## Cache busting

Cache busting is an important process when you want to work with `Expires` header on the server side. Here are some explanations on how Gulpy handle this workflow:

1. `gulpy.version()` appends a hash to filename by using [gulp-rev](https://github.com/sindresorhus/gulp-rev#readme) `image-1.jpg` → `image-1-7e44430a95.jpg`
2. `gulpy.version()` also writes a cache manifest file (from the `manifest` option passed to Gulpy constructor)
3. `gulpy.replaceVersion()` reads the cache manifest file and replaces occurrences of filenames in static files
   `body{background-image:url(img/image-1.jpg)}` → `body{background-image:url(img/image-1-7e44430a95.jpg)}`
4. `gulp.npmVersion()` generates a cache manifest for node_modules

## Local development

```
./node_modules/gulp/bin/gulp.js watch
```

You can also use browsersync:

```
./node_modules/gulp/bin/gulp.js watch --proxy http://localhost:8000
```

## Production:

```
./node_modules/gulp/bin/gulp.js --production
```

It will automatically handle production requirement (like files minification) and generate a manifest file for cache busting.
