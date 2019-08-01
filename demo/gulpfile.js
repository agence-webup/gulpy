const gulp = require('gulp')
const Gulpy = require('../src/Gulpy')

const gulpy = new Gulpy({
  dist: './dist'
})

const sass = gulpy.sass('src/sass/style.scss', 'dist/css')
const js = gulpy.js(['src/js/**/*', '!src/js/*.js'], 'dist/js')
const bundle = gulpy.bundle('src/js/*.js', 'dist/js', 'bundle.js')
const images = gulpy.images('src/images/**/*', 'dist/img')
const clean = gulpy.clean(['dist/**'])
const copyNpm = gulpy.copyNpm()
const version = gulpy.version()

exports.default = gulp.series(clean, sass, js, bundle, images, copyNpm)
exports.version = gulp.series(exports.default, version)
exports.sass = sass
exports.clean = clean
exports.watch = gulpy.watch()
