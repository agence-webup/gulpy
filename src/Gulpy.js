const gulp = require('gulp')
const del = require('del')
const argv = require('minimist')(process.argv.slice(2))
const log = require('fancy-log')
const c = require('ansi-colors')
const p = require('path')
const fs = require('fs')
const browserSync = require('browser-sync').create()

const _sass = require('./tasks/Sass')
const _less = require('./tasks/Less')
const _copyNpm = require('./tasks/CopyNpm')
const _copy = require('./tasks/Copy')
const _scripts = require('./tasks/Scripts')
const _images = require('./tasks/Images')
const _version = require('./tasks/Version')
const _replaceVersion = require('./tasks/ReplaceVersion')
const _npmVersion = require('./tasks/NpmVersion')

module.exports = class Gulpy {
  constructor (options) {
    this.argv = argv

    const defaultOptions = {
      publicFolder: null,
      manifest: 'rev-manifest.json',
      npmManifest: 'npm-manifest.json',
      production: !!argv.production || !!argv.prod,
      proxy: argv.proxy,
      browserSync: browserSync
    }

    this.options = { ...defaultOptions, ...options }

    this._checkup()

    this.plugins = {
      sass: new _sass(this.options),
      less: new _less(this.options),
      copy: new _copy(this.options),
      copyNpm: new _copyNpm(this.options),
      scripts: new _scripts(this.options),
      images: new _images(this.options),
      version: new _version(this.options),
      replaceVersion: new _replaceVersion(this.options),
      npmVersion: new _npmVersion(this.options)
    }

    this.toWatch = {
      sass: [],
      less: [],
      js: [],
      bundle: [],
      images: []
    }
  }

  _checkup () {
    if (this.options.publicFolder === null) {
      log.error(`${c.red('Error: you need to set the publicFolder option')}`)
      process.exit(1)
    }

    log.info('Starting Gulpy...')

    if (fs.existsSync('.browserslistrc')) {
      log.info(`Browserlist config: ${c.cyan('.browserslistrc found')}`)
    } else {
      log.error(`Browserlist config: ${c.red('Browserlist: .browserslistrc not found (https://github.com/browserslist/browserslist)')}`)
    }

    log.info(`Manifest: ${c.cyan(this.options.manifest)}`)
    log.info(`Public folder: ${c.cyan(this.options.publicFolder)}`)
  }

  isProduction () {
    return this.options.production
  }

  sass (src, dist, watch = false) {
    if (!watch) this.toWatch.sass.push([src, dist])
    return this.plugins.sass.getTask(src, dist)
  }

  less (src, dist, watch = false) {
    if (!watch) this.toWatch.less.push([src, dist])
    return this.plugins.less.getTask(src, dist)
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

  copy (src, dist) {
    return this.plugins.copy.getTask(src, dist)
  }

  version (src) {
    return this.plugins.version.getTask(src)
  }

  replaceVersion (src, dist) {
    return this.plugins.replaceVersion.getTask(src, dist)
  }

  npmVersion () {
    return this.plugins.npmVersion.getTask()
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
        const splitedPath = el[0].split(p.sep)
        splitedPath.pop()
        const toWatch = splitedPath.join(p.sep) + '/**/*.scss'
        log.info(`${c.green('Watching scss:')} ${toWatch}`)
        gulp.watch(toWatch, this.sass(el[0], el[1], true))
      })

      // watch Less
      this.toWatch.less.forEach((el) => {
        const splitedPath = el[0].split(p.sep)
        splitedPath.pop()
        const toWatch = splitedPath.join(p.sep) + '/**/*.less'
        log.info(`${c.green('Watching less:')} ${toWatch}`)
        gulp.watch(toWatch, this.less(el[0], el[1], true))
      })

      // watch JS
      this.toWatch.js.forEach((el) => {
        log.info(`${c.green('Watching js:')} ${el[0]}`)
        gulp.watch(el[0], this.js(el[0], el[1], true))
      })

      // watch JS (concat)
      this.toWatch.bundle.forEach((el) => {
        log.info(`${c.green('Watching js (bundle):')} ${el[0]}`)
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
