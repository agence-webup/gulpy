const gulp = require('gulp')
const npmDist = require('gulp-npm-dist')

module.exports = class CopyNpm {
  constructor (options) {
    this.options = options
  }

  getTask (dist) {
    const packages = npmDist()
    // if there is no packages to copy
    if (packages.length === 0) {
      return function copyNpm () {
        return Promise.resolve()
      }
    } else {
      return function copyNpm () {
        return gulp.src(packages, { base: './node_modules' })
          .pipe(gulp.dest(dist))
      }
    }
  }
}
