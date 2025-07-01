import gulp from 'gulp'
import { deleteAsync } from 'del'
import minimist from 'minimist'
import log from 'fancy-log'
import c from 'ansi-colors'
import p from 'path'
import fs from 'fs'
import browserSync from 'browser-sync'

import Sass from './tasks/Sass.js'
import Less from './tasks/Less.js'
import CopyNpm from './tasks/CopyNpm.js'
import Copy from './tasks/Copy.js'
import Scripts from './tasks/Scripts.js'
import Images from './tasks/Images.js'
import Version from './tasks/Version.js'
import ReplaceVersion from './tasks/ReplaceVersion.js'
import NpmVersion from './tasks/NpmVersion.js'
import Exec from './tasks/Exec.js'

const argv = minimist(process.argv.slice(2))
const bs = browserSync.create()

export default class Gulpy {
  constructor(options) {
    this.argv = argv

    const defaultOptions = {
      publicFolder: null,
      manifest: 'rev-manifest.json',
      npmManifest: 'npm-manifest.json',
      production: !!argv.production || !!argv.prod,
      proxy: argv.proxy,
      serve: argv.serve,
      browserSync: bs,
      mozjpeg: {
        progressive: true,
        quality: 85,
      },
      babelPresetEnv: {},
    }

    this.options = { ...defaultOptions, ...options }

    this._checkup()

    this.plugins = {
      sass: new Sass(this.options),
      less: new Less(this.options),
      copy: new Copy(this.options),
      copyNpm: new CopyNpm(this.options),
      scripts: new Scripts(this.options),
      images: new Images(this.options),
      version: new Version(this.options),
      replaceVersion: new ReplaceVersion(this.options),
      npmVersion: new NpmVersion(this.options),
      exec: new Exec(this.options),
    }

    this.toWatch = {
      sass: [],
      less: [],
      js: [],
      bundle: [],
      images: [],
      custom: [],
    }
  }

  _checkup() {
    if (this.options.publicFolder === null) {
      log.error(`${c.red('Error: you need to set the publicFolder option')}`)
      process.exit(1)
    }

    log.info('Starting Gulpy...')

    if (fs.existsSync('.browserslistrc')) {
      log.info(`Browserlist config: ${c.cyan('.browserslistrc found')}`)
    } else {
      log.error(
        `Browserlist config: ${c.red('Browserlist: .browserslistrc not found (https://github.com/browserslist/browserslist)')}`
      )
    }

    log.info(`Manifest: ${c.cyan(this.options.manifest)}`)
    log.info(`Public folder: ${c.cyan(this.options.publicFolder)}`)
    log.info(`JPEG quality: ${c.cyan(this.options.mozjpeg.quality)}`)
  }

  isProduction() {
    return this.options.production
  }

  sass(src, dist, watch = false) {
    if (!watch) this.toWatch.sass.push([src, dist])
    return this.plugins.sass.getTask(src, dist)
  }

  less(src, dist, watch = false) {
    if (!watch) this.toWatch.less.push([src, dist])
    return this.plugins.less.getTask(src, dist)
  }

  js(src, dist, watch = false) {
    if (!watch) this.toWatch.js.push([src, dist])
    return this.plugins.scripts.getTaskJs(src, dist)
  }

  bundle(src, dist, filename, watch = false) {
    if (!watch) this.toWatch.bundle.push([src, dist, filename])
    return this.plugins.scripts.getTaskBundle(src, dist, filename)
  }

  images(src, dist, watch = false) {
    if (!watch) this.toWatch.images.push([src, dist])
    return this.plugins.images.getTask(src, dist)
  }

  copyNpm(dist) {
    return this.plugins.copyNpm.getTask(dist)
  }

  copy(src, dist) {
    return this.plugins.copy.getTask(src, dist)
  }

  version(src) {
    return this.plugins.version.getTask(src)
  }

  replaceVersion(src, dist) {
    return this.plugins.replaceVersion.getTask(src, dist)
  }

  exec(command) {
    return this.plugins.exec.getTask(command)
  }

  npmVersion() {
    return this.plugins.npmVersion.getTask()
  }

  clean(paths) {
    return async function clean() {
      return deleteAsync(paths)
    }
  }

  clearCache() {
    return function clearCache(cb) {
      // Cache functionality removed for compatibility
      cb()
    }
  }

  addWatch(globs, options = {}, task) {
    // respect gulp parameters
    if (typeof options === 'function') {
      task = options
      options = {}
    }

    log.info(`Add custom watch: ${c.green(globs)}`)
    this.toWatch.custom.push([globs, options, task])
  }

  watch() {
    return () => {
      const bsDefaultOptions = {
        open: false,
        notify: true,
      }

      if (this.options.proxy) {
        browserSync.init({
          ...bsDefaultOptions,
          proxy: this.options.proxy,
        })
      } else if (this.options.serve) {
        browserSync.init({
          ...bsDefaultOptions,
          server: {
            baseDir: this.options.serve,
          },
        })
      }

      // custom
      this.toWatch.custom.forEach((el) => {
        gulp.watch(el[0], el[1], el[2])
      })

      // watch Sass
      this.toWatch.sass.forEach((el) => {
        const splitedPath = el[0].split(p.sep)
        splitedPath.pop()
        const toWatch = splitedPath.join(p.sep) + '/**/*.scss'
        log.info(`${c.green('Watching scss:')} ${toWatch}`)
        gulp.watch(toWatch, this.sass(el[0], el[1]))
      })

      // watch Less
      this.toWatch.less.forEach((el) => {
        const splitedPath = el[0].split(p.sep)
        splitedPath.pop()
        const toWatch = splitedPath.join(p.sep) + '/**/*.less'
        log.info(`${c.green('Watching less:')} ${toWatch}`)
        gulp.watch(toWatch, this.less(el[0], el[1]))
      })

      // watch JS
      this.toWatch.js.forEach((el) => {
        log.info(`${c.green('Watching js:')} ${el[0]}`)
        gulp.watch(el[0], this.js(el[0], el[1]))
      })

      // watch JS (concat)
      this.toWatch.bundle.forEach((el) => {
        log.info(`${c.green('Watching js (bundle):')} ${el[0]}`)
        gulp.watch(el[0], this.bundle(el[0], el[1], el[2]))
      })

      // watch images
      this.toWatch.images.forEach((el) => {
        log.info(`${c.green('Watching images:')} ${el[0]}`)
        gulp.watch(el[0], this.images(el[0], el[1]))
      })
    }
  }
}
