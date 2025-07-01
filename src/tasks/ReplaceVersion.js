import fs from 'fs'
import gulp from 'gulp'
import revRewrite from 'gulp-rev-rewrite'

export default class ReplaceVersion {
  constructor(options) {
    this.options = options
  }

  getTask(src, dist) {
    const self = this

    return function replaceVersion() {
      const manifest = fs.readFileSync(self.options.manifest)

      return gulp.src(src).pipe(revRewrite({ manifest })).pipe(gulp.dest(dist))
    }
  }
}
