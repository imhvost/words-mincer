import Random from './random.js'

function getAnswersAll (obj, task) {
  let words = []
  // obj = {
  //   'папа': '',
  //   'пасс': '',
  //   'брус': ''
  // }
  Object.keys(obj).forEach(key => {
    let keyObj = {}
    let taskObj = {}
    key.split('').forEach(letter => {
      if (!keyObj[letter]) {
        keyObj[letter] = 1
      } else {
        keyObj[letter]++
      }
    })
    // console.log(keyObj)
    task.split('').forEach(letter => {
      if (!taskObj[letter]) {
        taskObj[letter] = 1
      } else {
        taskObj[letter]++
      }
    })
    // console.log(taskObj)
    let isTrue = true
    let keys = Object.keys(keyObj)
    for (let index = 0; index < keys.length; index++) {
      let element = keys[index]
      if (!taskObj[element]) {
        isTrue = false
        break
      }
      if (keyObj[element] > taskObj[element]) {
        isTrue = false
        break
      }
    }
    if (isTrue) words.push(key)
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
