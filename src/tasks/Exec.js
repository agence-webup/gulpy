const _exec = require('child_process').exec
const log = require('fancy-log')
const c = require('ansi-colors')

module.exports = class Command {
  constructor (options) {
    this.options = options
  }

  getTask (command) {
    return function exec (cb) {
      _exec(command, (err, stdout, stderr) => {
        if (err) return cb(new Error(err))
        log('Running command...')
        log(c.cyan(`> ${command}`))
        process.stdout.write(stdout)
        cb()
      })
    }
  }
}
