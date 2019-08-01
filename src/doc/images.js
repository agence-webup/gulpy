const _path = require('path')
const gulp = require('gulp')
const through = require('through2')
const pngquant = require('imagemin-pngquant')
const mergeStream = require('merge-stream')

module.exports = (taskName, plugins, path, config) => {
  const stream = gulp.src(path.images.src, { since: gulp.lastRun(taskName) })
    .pipe(plugins.imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .pipe(config.production ? plugins.rev() : through.obj())
    .pipe(gulp.dest(path.images.dist))

  const stream1 = stream.pipe(config.production ? plugins.rev.manifest(config.paths.manifestFileBase, config.manifest) : through.obj())
    .pipe(config.production ? gulp.dest(config.paths.publicFolder) : through.obj())

  const stream2 = stream.pipe(config.production ? plugins.rename((p) => {
    p.dirname = _path.join(path.images.manifestPrefix, p.dirname)
  }) : through.obj())
    .pipe(config.production ? plugins.rev.manifest(config.paths.manifestFile, config.manifest) : through.obj())
    .pipe(config.production ? gulp.dest(config.paths.publicFolder) : through.obj())

  return mergeStream(stream1, stream2)
}
