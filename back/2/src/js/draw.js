function startDraw (event) {
  let span = event.target
  if (span.tagName !== 'SPAN') return
  this.$root.playAudio('draw')
  this.awards.state.input = true
  let letter = span.innerHTML
  this.answerLetters.push(letter)
  span.classList.add('active')
  let parent = span.closest('.task')
  let rect = span.getBoundingClientRect()
  let recParent = parent.getBoundingClientRect()
  let x = rect.left - recParent.left + rect.width / 2
  let y = rect.top - recParent.top + rect.height / 2
  this.d = `M${x},${y} `
  this.isDraw = true
}

function draw (event) {
  if (!this.isDraw) return
  let parent = event.target.closest('.task')
  let recParent = parent.getBoundingClientRect()
  let target = event.target
  let clientX
  let clientY
  if (event.touches) {
    let touch = event.touches[0]
    clientX = touch.clientX
    clientY = touch.clientY
    document.querySelector('html').style.overflowY = 'hidden'
    target = document.elementFromPoint(clientX, clientY)
  } else {
    clientX = event.clientX
    clientY = event.clientY
  }
  if (target.classList.contains('task-letter')) {
    if (!target.classList.contains('active')) {
      this.$root.playAudio('draw')
      let letter = target.innerHTML
      let rect = target.getBoundingClientRect()
      target.classList.add('active')
      this.answerLetters.push(letter)
      let x = rect.left - recParent.left + rect.width / 2
      let y = rect.top - recParent.top + rect.height / 2
      let path = this.d.split(' ')
      path.pop()
      path.push(`L${x},${y}`)
      path = path.join(' ')
      this.d = path
    }
  }
  let pathLength = this.answerLetters.length
  let x = clientX - recParent.left
  let y = clientY - recParent.top
  let path = this.d.split(' ')
  path[pathLength] = `L${x},${y}`
  path = path.join(' ')
  this.d = path
}

function endDraw (event) {
  if (!this.isDraw) return
  let target = event.target
  let clientX
  let clientY
  if (event.touches) {
    let touch = event.changedTouches[event.changedTouches.length - 1]
    clientX = touch.pageX
    clientY = touch.pageY
    target = document.elementFromPoint(clientX, clientY)
  }
  document.querySelectorAll('.task span').forEach(el => {
    el.classList.remove('active')
  })
  document.querySelector('html').style.overflowY = 'auto'
  this.d = ''
  let answer = this.answerLetters.join('')
  this.answerLetters = []
  this.isDraw = false
  if (target.classList.contains('task-cancel')) {
    this.awards.state.reset++
    if (this.awards.state.reset === 10) this.addAward('skew')
  }
  if (answer.length >= 2 && answer.length <= this.task.length && !target.classList.contains('task-cancel')) {
    this.checkAnswer(answer)
  }
}

function pressDraw (event) {
  this.$root.playAudio('draw')
  this.awards.state.input = true
  let parent = event.target.closest('.task')
  let recParent = parent.getBoundingClientRect()
  let target = event.target
  if (!target.classList.contains('active')) {
    let letter = target.innerHTML
    let rect = target.getBoundingClientRect()
    target.classList.add('active')
    this.answerLetters.push(letter)
    let x = rect.left - recParent.left + rect.width / 2
    let y = rect.top - recParent.top + rect.height / 2
    if (!this.isDraw) {
      this.d = `M${x},${y} `
      this.isDraw = true
      return
    }
    let path = this.d.split(' ')
    // path.pop()
    path.push(`L${x},${y}`)
    path = path.join(' ')
    this.d = path
  }
}

function endPressDraw (event, cancel) {
  document.querySelectorAll('.task span').forEach(el => {
    el.classList.remove('active')
  })
  document.querySelector('html').style.overflowY = 'auto'
  this.d = ''
  let answer = this.answerLetters.join('')
  this.answerLetters = []
  this.isDraw = false
  if (!cancel) {
    this.checkAnswer(answer)
  } else {
    this.awards.state.reset++
    if (this.awards.state.reset === 10) this.addAward('skew')
  }
}

export default {
  startDraw: startDraw,
  draw: draw,
  endDraw: endDraw,
  pressDraw: pressDraw,
  endPressDraw: endPressDraw
}
