const gulp = require('gulp')
const del = require('del')
const _sass = require('./tasks/Sass')
const _copyNpm = require('./tasks/CopyNpm')
const _scripts = require('./tasks/Scripts')
const _images = require('./tasks/Images')
const _version = require('./tasks/Version')

module.exports = class Gulpy {
  constructor (options) {
    this.options = options

    this.plugins = {
      sass: new _sass(options),
      copyNpm: new _copyNpm(options),
      scripts: new _scripts(options),
      images: new _images(options),
      version: new _version(options)
    }

    this.toWatch = {
      sass: [],
      js: [],
      bundle: [],
      images: []
    }
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
    if (!watch) this.toWatch.bundle.push([src, dist])
    return this.plugins.scripts.getTaskBundle(src, dist, filename)
  }

  images (src, dist, watch = false) {
    return this.plugins.images.getTask(src, dist)
  }

  copyNpm () {
    return this.plugins.copyNpm.getTask()
  }

  version () {
    return this.plugins.version.getTask()
  }

  clean (paths) {
    return function clean () {
      return del(paths)
    }
  }

  watch () {
    return () => {
      this.toWatch.sass.forEach((el) => {
        console.log(`sass: watching ${el}`)
        gulp.watch(el, this.sass(el, true))
      })
    }
  }
}
