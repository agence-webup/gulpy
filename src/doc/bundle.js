const gulp = require('gulp')
const _path = require('path')
const through = require('through2')

module.exports = function (plugins, path, config) {
  return gulp.src(path.jsBundle.src)
    .pipe(plugins.plumber())
    .pipe(plugins.babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(plugins.uglify())
    .pipe(plugins.concat('bundle.js'))
    .pipe(config.production ? plugins.rev() : through.obj())
    .pipe(gulp.dest(path.jsBundle.dist))
    .pipe(config.production ? plugins.rename((p) => {
      p.dirname = _path.join(path.jsBundle.manifestPrefix, p.dirname)
    }) : through.obj())
    .pipe(config.production ? plugins.rev.manifest(config.paths.manifestFile, config.manifest) : through.obj())
    .pipe(config.production ? gulp.dest(config.paths.publicFolder) : through.obj())
}
