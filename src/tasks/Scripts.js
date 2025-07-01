import gulp from 'gulp'
import terser from 'gulp-terser'
import concat from 'gulp-concat'
import babel from 'gulp-babel'
import plumber from 'gulp-plumber'
import through from 'through2'

export default class Scripts {
  constructor(options) {
    this.options = options
  }

  getTaskJs(src, dist) {
    const self = this
    return function js() {
      return gulp
        .src(src)
        .pipe(plumber())
        .pipe(
          babel({
            presets: [['@babel/preset-env', self.options.babelPresetEnv]],
          })
        )
        .pipe(self.options.production ? terser() : through.obj())
        .pipe(gulp.dest(dist))
    }
  }

  getTaskBundle(src, dist, filename) {
    const self = this
    return function bundle() {
      return gulp
        .src(src)
        .pipe(plumber())
        .pipe(
          babel({
            presets: ['@babel/preset-env'],
          })
        )
        .pipe(self.options.production ? terser() : through.obj())
        .pipe(concat(filename))
        .pipe(gulp.dest(dist))
    }
  }
}
