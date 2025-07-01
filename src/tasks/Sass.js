import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import * as sass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import through from 'through2'

const gulpSassInstance = gulpSass(sass)

export default class Sass {
  constructor(options) {
    this.options = options
  }

  getTask(src, dist) {
    const self = this
    return function sass() {
      return gulp
        .src(src)
        .pipe(gulpSassInstance().on('error', gulpSassInstance.logError))
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
