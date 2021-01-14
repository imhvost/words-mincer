import Random from './random.js'

function getAnswersAll (obj, word) {
  let words = []
  Object.keys(obj).forEach(key => {
    let satisfies = true
    for (let i = 0; i < key.length; i++) {
      if (!satisfies) break
      let count = word.match(new RegExp(key[i], 'g'))
      let count2 = key.match(new RegExp(key[i], 'g'))
      if (count && count2) {
        if (count.length === count2.length) continue
      }
      satisfies = false
    }
    if (satisfies) words.push(key)
  })
  return words
}

function getTask (obj, level = 1, levels = 20) {
  let keys = Object.keys(obj)
  let levelWord = Random.getRandom(keys.length, level, levels)
  return Object.keys(obj)[levelWord] || Object.keys(obj)[1]
}

function getAnswers (answers, sublevels) {
  let filtering = []
  Object.keys(answers).forEach(key => {
    let words = answers[key]
    let maxWords = sublevels[key]
    words = words.sort(() => { return 0.5 - Math.random() })
    words = words.slice(0, maxWords)
    words.forEach(element => {
      filtering.push({
        answer: element,
        helpers: Array(element.length)
      })
    })
  })
  return filtering
}

export default {
  getTask: getTask,
  getAnswersAll: getAnswersAll,
  getAnswers: getAnswers
}
