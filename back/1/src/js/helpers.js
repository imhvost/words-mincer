function openFirstLetters () {
  let data = this.userData.helpers.openFirstLetters
  let config = this.config.helpers.openFirstLetters.levels
  let words = config[data.level].words
  let letters = config[data.level].letters
  let answers = []
  this.answers.forEach(el => {
    if (!el.helpers[0] || !el.helpers[letters - 1]) answers.push(el)
  })
  if (!answers.length) {
    this.openNothing('openFirstLetters')
    return
  }
  if (!data.count) return
  data.count--
  if (data.count === 0) this.finishHelper('openFirstLetters')
  this.playAudio('./static/audio/openFirstLetters.mp3')
  answers.sort(() => { return 0.5 - Math.random() })
  for (let index = 0; index < words; index++) {
    if (!answers[index]) continue
    let word = answers[index].answer
    this.answers.forEach((el, index) => {
      if (el.answer === word) {
        for (let i = 0; i < letters; i++) {
          let helpers = this.answers[index].helpers
          helpers[i] = el.answer[i]
          this.answers[index].helpers = helpers
        }
      }
    })
  }
}

function openLastLetters () {
  let data = this.userData.helpers.openLastLetters
  let config = this.config.helpers.openLastLetters.levels
  let words = config[data.level].words
  let letters = config[data.level].letters
  let answers = []
  this.answers.forEach(el => {
    if (!el.helpers[el.helpers.length - 1] || !el.helpers[el.helpers.length - letters]) answers.push(el)
  })
  if (!answers.length) {
    this.openNothing('openLastLetters')
    return
  }
  if (!data.count) return
  data.count--
  if (data.count === 0) this.finishHelper('openLastLetters')
  this.playAudio('./static/audio/openLastLetters.mp3')
  answers.sort(() => { return 0.5 - Math.random() })
  for (let index = 0; index < words; index++) {
    if (!answers[index]) continue
    let word = answers[index].answer
    this.answers.forEach((el, index) => {
      if (el.answer === word) {
        for (let i = word.length + letters; i > word.length; i--) {
          let helpers = this.answers[index].helpers
          helpers[i - letters - 1] = el.answer[i - letters - 1]
          this.answers[index].helpers = helpers
        }
      }
    })
  }
}

function bomb () {
  let data = this.userData.helpers.bomb
  let config = this.config.helpers.bomb.levels
  let letters = config[data.level].letters
  let answers = []
  this.answers.forEach(el => {
    let isNotAnswered = false
    for (let index = 0; index < el.helpers.length; index++) {
      let helpers = el.helpers[index]
      if (!helpers) isNotAnswered = true
    }
    if (isNotAnswered) answers.push(el)
  })
  if (!answers.length) {
    this.openNothing('bomb')
    return
  }
  if (!data.count) return
  data.count--
  if (data.count === 0) this.finishHelper('bomb')
  answers.sort(() => { return 0.5 - Math.random() })
  this.playAudio('./static/audio/bomb.mp3')
  openLetter(letters, answers, this)
  function openLetter (letters, answers, context) {
    if (!letters) return
    if (!answers[0]) return
    let indexes = []
    for (let i = 0; i < answers[0].helpers.length; i++) {
      if (!answers[0].helpers[i]) indexes.push(i)
    }
    indexes.sort(() => { return 0.5 - Math.random() })
    context.answers.forEach((el, index) => {
      if (el.answer === answers[0].answer) {
        let helpers = el.answer[indexes[0]]
        context.answers[index].helpers[indexes[0]] = helpers
      }
    })
    let newAnswers = []
    context.answers.forEach(el => {
      let isNotAnswered = false
      for (let index = 0; index < el.helpers.length; index++) {
        let helpers = el.helpers[index]
        if (!helpers) isNotAnswered = true
      }
      if (isNotAnswered) newAnswers.push(el)
    })
    newAnswers.sort(() => { return 0.5 - Math.random() })
    letters--
    return openLetter(letters, newAnswers, context)
  }
}

export default {
  openFirstLetters: openFirstLetters,
  openLastLetters: openLastLetters,
  bomb: bomb
}
