import gulp from 'gulp'

export default class Images {
  constructor(options) {
    this.options = options
  }

  getTask(src, dist) {
    const self = this
    return function images() {
      return new Promise(async (resolve, reject) => {
        try {
          const imageminModule = await import('gulp-imagemin')
          const imagemin = imageminModule.default
          const { gifsicle, mozjpeg, optipng, svgo } = imageminModule

          gulp
            .src(src)
            .pipe(
              imagemin(
                [
                  gifsicle({ interlaced: true }),
                  mozjpeg(self.options.mozjpeg),
                  optipng({ optimizationLevel: 5 }),
                  svgo({
                    plugins: [
                      { name: 'removeViewBox', active: false },
                      { name: 'cleanupIDs', active: false },
                    ],
                  }),
                ],
                { verbose: true }
              )
            )
            .pipe(gulp.dest(dist))
            .on('end', resolve)
            .on('error', reject)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
