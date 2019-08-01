const gulp = require('gulp')
const imagemin = require('gulp-imagemin')

module.exports = class Images {
  constructor (options) {
    this.options = options
  }

  getTask (src, dist) {
    return function images () {
      return gulp.src(src)
        .pipe(imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest(dist))
    }
  }
}
