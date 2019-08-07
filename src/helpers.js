const _path = require('path')

function cleanPath (path) {
  const splitedPath = path.split(_path.sep)
  while (splitedPath[splitedPath.length - 1] === '*' || splitedPath[splitedPath.length - 1] === '**') {
    splitedPath.pop()
  }
  return splitedPath.join(_path.sep)
}

module.exports = {
  cleanPath
}
