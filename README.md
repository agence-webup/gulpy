# Gulpy

## Install

```shell
npm i -D @agence-webup/gulpy
```

## Example

In your gulpfile.js:

```js
const gulp = require('gulp')
const Gulpy = require('@agence-webup/gulpy')

// config
const gulpy = new Gulpy({
  publicFolder: 'dist',
  manifest: 'dist/rev-manifest.json',
  npmManifest: 'dist/npm-manifest.json'
})

// tasks
const sass = gulpy.sass('src/sass/style.scss', 'dist/css') // this will watch all .scss files in src/sass/**/*
const js = gulpy.js(['src/js/**/*', '!src/js/*.js'], 'dist/js')
const bundle = gulpy.bundle('src/js/*.js', 'dist/js', 'bundle.js')
const images = gulpy.images('src/img/**/*', 'dist/img')
const copy = gulpy.copy('src/fonts/**/*', 'dist/fonts')
const clean = gulpy.clean(['dist/**'])
const copyNpm = gulpy.copyNpm('dist/node_modules')
const version = gulpy.version(['dist/**', '!dist/node_modules/**'])
const npmVersion = gulpy.npmVersion()

// export
exports.default = gulp.series(clean, gulp.series(sass, js, bundle, images, copy, copyNpm))
if (gulpy.isProduction()) {
  exports.default = gulp.series(exports.default, version, npmVersion)
}
exports.watch = gulpy.watch()

```

## Methods

* `sass(src, dist)`
* `js(src, dist)`
* `bundle(src, dist, filename)`
* `images(src, dist)`
* `clean(dist)`
* `copy(src, dist)`
* `copyNpm(dist)`
* `version(src)`
* `npmVersion()` generate a cache manifest for node_modules (useful for cache busting)
* `watch()` auto watch all configured tasks
* `isProduction()` return true if the flag --production or --prod is used

`src` and `dist`can be glob strings (https://gulpjs.com/docs/en/getting-started/explaining-globs)

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
