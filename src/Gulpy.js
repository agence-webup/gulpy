const gulp = require('gulp')
const del = require('del')
const argv = require('minimist')(process.argv.slice(2))
const log = require('fancy-log')
const c = require('ansi-colors')
const browserSync = require('browser-sync').create()

const _sass = require('./tasks/Sass')
const _copyNpm = require('./tasks/CopyNpm')
const _scripts = require('./tasks/Scripts')
const _images = require('./tasks/Images')
const _version = require('./tasks/Version')

module.exports = class Gulpy {
  constructor (options) {
    this.argv = argv

    const defaultOptions = {
      browsers: ['> 1%', 'not dead'],
      production: !!argv.production || !!argv.prod,
      proxy: argv.proxy,
      browserSync: browserSync
    }

    this.options = { ...defaultOptions, ...options }

    this.plugins = {
      sass: new _sass(this.options),
      copyNpm: new _copyNpm(this.options),
      scripts: new _scripts(this.options),
      images: new _images(this.options),
      version: new _version(this.options)
    }

    this.toWatch = {
      sass: [],
      js: [],
      bundle: [],
      images: []
    }
  }

  isProduction () {
    return this.options.production
  }

  sass (src, dist, watch = false) {
    if (!watch) this.toWatch.sass.push([src, dist])
    return this.plugins.sass.getTask(src, dist)
  }

  js (src, dist, watch = false) {
    if (!watch) this.toWatch.js.push([src, dist])
    return this.plugins.scripts.getTaskJs(src, dist)
  }

  bundle (src, dist, filename, watch = false) {
    if (!watch) this.toWatch.bundle.push([src, dist, filename])
    return this.plugins.scripts.getTaskBundle(src, dist, filename)
  }

  images (src, dist, watch = false) {
    if (!watch) this.toWatch.images.push([src, dist])
    return this.plugins.images.getTask(src, dist)
  }

  copyNpm (dist) {
    return this.plugins.copyNpm.getTask(dist)
  }

  version (src) {
    return this.plugins.version.getTask(src)
  }

  clean (paths) {
    return function clean () {
      return del(paths)
    }
  }

  watch () {
    return () => {
      if (this.options.proxy) {
        browserSync.init({
          open: false,
          notify: true,
          proxy: this.options.proxy
        })
      }

      // watch Sass
      this.toWatch.sass.forEach((el) => {
        log.info(`${c.green('Watching Sass:')} ${el[0]}`)
        gulp.watch(el[0], this.sass(el[0], el[1], true))
      })

      // watch JS
      this.toWatch.js.forEach((el) => {
        log.info(`${c.green('Watching JS:')} ${el[0]}`)
        gulp.watch(el[0], this.js(el[0], el[1], true))
      })

      // watch JS (concat)
      this.toWatch.bundle.forEach((el) => {
        log.info(`${c.green('Watching JS (bundle):')} ${el[0]}`)
        gulp.watch(el[0], this.bundle(el[0], el[1], el[2], true))
      })

      // watch images
      this.toWatch.images.forEach((el) => {
        log.info(`${c.green('Watching images:')} ${el[0]}`)
        gulp.watch(el[0], this.images(el[0], el[1], true))
      })
    }
  }
}
