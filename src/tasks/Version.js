const gulp = require('gulp')
const rev = require('gulp-rev')
const revRewrite = require('gulp-rev-rewrite')
const filter = require('gulp-filter')

module.exports = class Version {
  constructor (options) {
    this.options = options
  }

  getTask (src) {
    const assetFilter = filter(['**', '!**/*.css'], { restore: true })

    return function version () {
      return gulp.src(src)
        .pipe(assetFilter)
        .pipe(rev()) // rev except CSS
        .pipe(assetFilter.restore)
        .pipe(revRewrite()) // rewrite URL in CSS
        .pipe(rev()) // rev CSS
        .pipe(gulp.dest(src))
        .pipe(rev.manifest())
        .pipe(gulp.dest(src))
    }
  }
}
