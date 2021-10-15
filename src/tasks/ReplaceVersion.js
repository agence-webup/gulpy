const fs = require('fs')
const gulp = require('gulp')
const revRewrite = require('gulp-rev-rewrite')

module.exports = class ReplaceVersion {
  constructor (options) {
    this.options = options
  }

  getTask (src, dist) {
    const self = this

    return function replaceVersion () {
      const manifest = fs.readFileSync(self.options.manifest)

      return gulp.src(src)
        .pipe(revRewrite({ manifest }))
        .pipe(gulp.dest(dist))
    }
  }
}
