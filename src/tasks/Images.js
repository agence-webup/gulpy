const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const cache = require('gulp-cache')

module.exports = class Images {
  constructor (options) {
    this.options = options
  }

  getTask (src, dist) {
    return function images () {
      return gulp.src(src)
        .pipe(cache(imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imageminMozjpeg({
            progressive: true,
            quality: 75
          }),
          imagemin.optipng(),
          imagemin.svgo()
        ], { verbose: true })))
        .pipe(gulp.dest(dist))
    }
  }
}
