# Gulpy

## Install

```shell
npm i @agence-webup/gulpy
```

## Example

In your gulpfile.js:

```js
const gulp = require('gulp')
const Gulpy = require('../src/index')

// config
const gulpy = new Gulpy({
  browsers: ['> 2%', 'not dead']
})

// tasks
const sass = gulpy.sass('src/sass/style.scss', 'dist/css')
const js = gulpy.js(['src/js/**/*', '!src/js/*.js'], 'dist/js')
const bundle = gulpy.bundle('src/js/*.js', 'dist/js', 'bundle.js')
const images = gulpy.images('src/img/**/*', 'dist/img')
const clean = gulpy.clean(['dist/**'])
const copyNpm = gulpy.copyNpm()
const version = gulpy.version()

// export
exports.default = gulp.series(clean, gulp.series(sass, js, bundle, images, copyNpm))
if (gulpy.isProduction()) {
  exports.default = gulp.series(exports.default, version)
}
exports.watch = gulpy.watch()
```

## Use it

## Local development:

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
