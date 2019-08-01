const gulp = require('gulp')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const through = require('through2')

module.exports = class Scripts {
  constructor (options) {
    this.options = options
  }

  getTaskJs (src, dist) {
    const self = this
    return function js () {
      return gulp.src(src)
        .pipe(plumber())
        .pipe(babel({
          presets: ['@babel/preset-env']
        }))
        .pipe(self.options.production ? uglify() : through.obj())
        .pipe(gulp.dest(dist))
    }
  }

  getTaskBundle (src, dist, filename) {
    const self = this
    return function bundle () {
      return gulp.src(src)
        .pipe(plumber())
        .pipe(babel({
          presets: ['@babel/preset-env']
        }))
        .pipe(self.options.production ? uglify() : through.obj())
        .pipe(concat(filename))
        .pipe(gulp.dest(dist))
    }
  }
}
