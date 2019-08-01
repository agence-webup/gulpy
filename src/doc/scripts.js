const gulp = require('gulp')
const _path = require('path')
const through = require('through2')

module.exports = (taskName, plugins, path, config) => {
  return gulp.src([path.js.src, '!' + path.jsBundle.src], { since: gulp.lastRun(taskName) })
    .pipe(plugins.plumber())
    .pipe(plugins.babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(plugins.uglify())
    .pipe(config.production ? plugins.rev() : through.obj())
    .pipe(gulp.dest(path.js.dist))
    .pipe(config.production ? plugins.rename((p) => {
      p.dirname = _path.join(path.js.manifestPrefix, p.dirname)
    }) : through.obj())
    .pipe(config.production ? plugins.rev.manifest(config.paths.manifestFile, config.manifest) : through.obj())
    .pipe(config.production ? gulp.dest(config.paths.publicFolder) : through.obj())
}
