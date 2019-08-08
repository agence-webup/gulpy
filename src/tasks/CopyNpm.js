const gulp = require('gulp')
const npmDist = require('gulp-npm-dist')

const EXCLUDED_FROM_NPM = [
  '*.map',
  'examples/**/*',
  'example/**/*',
  'demo/**/*',
  'spec/**/*',
  'docs/**/*',
  'tests/**/*',
  'test/**/*',
  'Gruntfile.js',
  'gulpfile.js',
  'package.json',
  'package-lock.json',
  'bower.json',
  'composer.json',
  'yarn.lock',
  'webpack.config.js',
  'README',
  'LICENSE',
  'CHANGELOG',
  '*.yml',
  '*.md',
  '*.coffee',
  '*.ts',
  '*.scss',
  '*.less'
]

module.exports = class CopyNpm {
  constructor (options) {
    this.options = options
  }

  getTask (dist) {
    const packages = npmDist({
      replaceDefaultExcludes: true,
      copyUnminified: true,
      excludes: EXCLUDED_FROM_NPM
    })
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
