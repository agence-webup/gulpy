import gulp from 'gulp'
import rev from 'gulp-rev'
import path from 'path'

export default class Version {
  constructor(options) {
    this.options = options
  }

  getTask(src) {
    const self = this

    return function version() {
      return gulp
        .src(src, { base: self.options.publicFolder })
        .pipe(rev())
        .pipe(gulp.dest(self.options.publicFolder))
        .pipe(
          rev.manifest(path.basename(self.options.manifest), {
            merge: true,
          })
        )
        .pipe(gulp.dest(self.options.publicFolder))
    }
  }
}
