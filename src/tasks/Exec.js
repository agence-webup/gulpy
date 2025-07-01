import { exec as _exec } from 'child_process'
import log from 'fancy-log'
import c from 'ansi-colors'

export default class Command {
  constructor(options) {
    this.options = options
  }

  getTask(command) {
    return function exec(cb) {
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
