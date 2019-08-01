const gulp = require('gulp')
const gulpSass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const through = require('through2')

module.exports = class Sass {
  constructor (options) {
    this.options = options
  }

  getTask (src, dist) {
    const self = this
    return function sass () {
      return gulp.src(src)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(autoprefixer({
          overrideBrowserslist: self.options.browsers
        }))
        .pipe(self.options.production ? cleanCSS() : through.obj())
        .pipe(gulp.dest(dist))
        .pipe(self.options.browserSync.stream())
    }
  }
}
