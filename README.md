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
const sass = gulpy.sass('src/sass/style.scss', 'dist/css') // this will automatically watch all .scss files in src/sass/**/*
const js = gulpy.js(['src/js/**/*', '!src/js/*.js'], 'dist/js')
const bundle = gulpy.bundle('src/js/*.js', 'dist/js', 'bundle.js')
const images = gulpy.images('src/img/**/*', 'dist/img')
const copyNpm = gulpy.copyNpm('dist/node_modules')
const version = gulpy.version(['dist/**', '!dist/node_modules/**', '!**/*.html'])
const npmVersion = gulpy.npmVersion()
const clean = gulpy.clean(['dist/**'])
const copy = gulp.parallel(
  gulpy.copy('src/fonts/**/*', 'dist/fonts'),
  gulpy.copy('src/**/*.html', 'dist')
)
const replaceVersion = gulp.parallel(
  gulpy.replaceVersion('dist/**/*.css', 'dist'),
  gulpy.replaceVersion('dist/**/*.html', 'dist')
)

// export
exports.default = gulp.series(clean, gulp.series(sass, js, bundle, images, copy, copyNpm))
if (gulpy.isProduction()) {
  exports.default = gulp.series(exports.default, version, replaceVersion, npmVersion)
}
exports.watch = gulpy.watch()


```

## Methods

* `sass(src, dist)`
* `less(src, dist)`
* `js(src, dist)`
* `bundle(src, dist, filename)`
* `images(src, dist)`
* `clean(dist)`
* `copy(src, dist)`
* `copyNpm(dist)`
* `version(src)`
* `replaceVersion(src, dist)` rewrite occurrences of filenames using the cache manifest in static files
* `npmVersion()` generate a cache manifest for node_modules (useful for cache busting)
* `watch()` auto watch all configured tasks
* `clearCache()` clear the cache (mainly used for images)
* `isProduction()` return true if the flag --production or --prod is used

`src` and `dist`can be glob strings (https://gulpjs.com/docs/en/getting-started/explaining-globs)

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
