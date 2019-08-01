const gulp = require('gulp')
const gulpSass = require('gulp-sass')

module.exports = class Sass {
  constructor (options) {
    this.options = options
  }

  getTask (src, dist) {
    const self = this
    return function sass () {
      return gulp.src(src)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest(dist))
    }
  }
}
