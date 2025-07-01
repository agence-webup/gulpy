import gulp from 'gulp'
import gulpLess from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import through from 'through2'

export default class Less {
  constructor(options) {
    this.options = options
  }

  getTask(src, dist) {
    const self = this
    return function less() {
      return gulp
        .src(src)
        .pipe(gulpLess())
        .pipe(
          autoprefixer({
            overrideBrowserslist: self.options.browsers,
          })
        )
        .pipe(self.options.production ? cleanCSS() : through.obj())
        .pipe(gulp.dest(dist))
        .pipe(self.options.browserSync.stream())
    }
  }
}
