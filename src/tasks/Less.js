const gulp = require('gulp')
const gulpLess = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const through = require('through2')

module.exports = class Less {
  constructor (options) {
    this.options = options
  }

  getTask (src, dist) {
    const self = this
    return function less () {
      return gulp.src(src)
        .pipe(gulpLess())
        .pipe(autoprefixer({
          overrideBrowserslist: self.options.browsers
        }))
        .pipe(self.options.production ? cleanCSS() : through.obj())
        .pipe(gulp.dest(dist))
        .pipe(self.options.browserSync.stream())
    }
  }
}
