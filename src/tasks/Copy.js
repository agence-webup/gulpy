const gulp = require('gulp')

module.exports = class Copy {
  constructor (options) {
    this.options = options
  }

  getTask (src, dist) {
    return function copy () {
      return gulp.src(src)
        .pipe(gulp.dest(dist))
    }
  }
}
