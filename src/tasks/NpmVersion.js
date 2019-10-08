const fs = require('fs')
const crypto = require('crypto')

module.exports = class NpmVersion {
  constructor (options) {
    this.options = options
  }

  getTask () {
    const self = this
    return function npmVersion (cb) {
      try {
        const data = fs.readFileSync('./package-lock.json')
        const dependencies = JSON.parse(data).dependencies
        const versions = {}
        Object.entries(dependencies).forEach((el) => {
          const cacheValue = el[1].version ? el[1].version : 'noversion'
          versions[el[0]] = crypto.createHash('md5').update(cacheValue).digest('hex')
        })
        fs.writeFileSync(self.options.npmManifest, JSON.stringify(versions, null, 4))
        cb()
      } catch (error) {
        cb(new Error('Unable to read package-lock.json'))
      }
    }
  }
}
