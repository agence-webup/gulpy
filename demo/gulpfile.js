const gulp = require('gulp')
const Gulpy = require('../src/index')

// config
const gulpy = new Gulpy({
  publicFolder: 'dist',
  manifest: 'dist/rev-manifest.json'
})

// tasks
const sass = gulpy.sass('src/sass/style.scss', 'dist/css')
const js = gulpy.js(['src/js/**/*', '!src/js/*.js'], 'dist/js')
const bundle = gulpy.bundle('src/js/*.js', 'dist/js', 'bundle.js')
const images = gulpy.images('src/img/**/*', 'dist/img')
const clean = gulpy.clean(['dist/**'])
const copyNpm = gulpy.copyNpm('dist/node_modules')
const version = gulpy.version(['dist/**', '!dist/node_modules/**'])

// export
exports.default = gulp.series(clean, gulp.series(sass, js, bundle, images, copyNpm))
if (gulpy.isProduction()) {
  exports.default = gulp.series(exports.default, version)
}
exports.watch = gulpy.watch()
