const gulp = require('gulp')
const rev = require('gulp-rev')
const revRewrite = require('gulp-rev-rewrite')
const filter = require('gulp-filter')
const helpers = require('../helpers.js')

module.exports = class Version {
  constructor (options) {
    this.options = options
  }

  getTask (src) {
    const self = this
    const assetFilter = filter(['**', '!**/*.css'], { restore: true })
    return function version () {
      return gulp.src(src)
        .pipe(assetFilter)
        .pipe(rev())
        .pipe(assetFilter.restore)
        .pipe(revRewrite())
        .pipe(gulp.dest(helpers.cleanPath(src)))
        .pipe(rev())
        .pipe(rev.manifest(self.options.manifest, {
          merge: true
        }))
        .pipe(gulp.dest('./'))
    }
  }
}
