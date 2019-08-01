const gulp = require('gulp')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')

module.exports = class Scripts {
  constructor (options) {
    this.options = options
  }

  getTaskJs (src, dist) {
    return function js () {
      return gulp.src(src)
        .pipe(uglify())
        .pipe(gulp.dest(dist))
    }
  }

  getTaskBundle (src, dist, filename) {
    return function js () {
      return gulp.src(src)
        .pipe(concat(filename))
        .pipe(gulp.dest(dist))
    }
  }
}
