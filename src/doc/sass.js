const gulp = require('gulp')
const _path = require('path')
const through = require('through2')

module.exports = (taskName, plugins, path, config, browserSync) => {
  const manifest = config.production ? gulp.src(config.paths.manifestFileBase) : null

  return gulp.src(path.sass.src)
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer({
      browsers: ['> 1%', 'not dead']
    }))
    .pipe(config.production ? plugins.cleanCss() : through.obj())
    .pipe(config.production ? plugins.rev() : through.obj())
    .pipe(config.production ? plugins.revRewrite({ manifest }) : through.obj())
    .pipe(gulp.dest(path.sass.dist))
    .pipe(browserSync.stream())
    .pipe(config.production ? plugins.rename((p) => {
      p.dirname = _path.join(path.sass.manifestPrefix, p.dirname)
    }) : through.obj())
    .pipe(config.production ? plugins.rev.manifest(config.paths.manifestFile, config.manifest) : through.obj())
    .pipe(config.production ? gulp.dest(config.paths.publicFolder) : through.obj())
}
