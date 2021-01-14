function getRandom (max, currentLevel = 1, levelsCount = 20, smoothness = 4) {
  let range = max / levelsCount
  let point = range * currentLevel - range / 2
  let offset = point < max / 2 ? max / 2 - point : point - max / 2
  let result = point < max / 2 ? weightedRandom(max, smoothness) - offset : weightedRandom(max, smoothness) + offset
  result = calibrationRandom(result, point, max)
  result = Math.round(result)
  return result
}
function weightedRandom (max, smoothness) {
  let result = 0
  for (let i = 0; i < smoothness; ++i) {
    result += Math.random() * (max / smoothness)
  }
  return result
}
function calibrationRandom (result, point, keys, maxCalls = 0) {
  if (maxCalls === 20) {
    // console.log('max calls...')
    return keys * Math.random() << 0
  }
  maxCalls++
  if (point < keys / 2) {
    if (result > 0) return result
    // console.log('out random...')
    result = point + result
    return calibrationRandom(result, point, keys, maxCalls)
  }
  if (point > keys / 2) {
    if (result < keys) return result
    // console.log('over random...')
    result = point + result - keys
    return calibrationRandom(result, point, keys, maxCalls)
  }
  return result
}

export default {
  getRandom: getRandom
}
