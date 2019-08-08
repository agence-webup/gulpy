const gulp = require('gulp')
const rev = require('gulp-rev')

module.exports = class Version {
  constructor (options) {
    this.options = options
  }

  getTask (src) {
    const self = this

    return function version () {
      return gulp.src(src, { base: self.options.publicFolder })
        .pipe(rev())
        .pipe(gulp.dest(self.options.publicFolder))
        .pipe(rev.manifest(self.options.manifest, {
          merge: true
        }))
        .pipe(gulp.dest('./'))
    }
  }
}
