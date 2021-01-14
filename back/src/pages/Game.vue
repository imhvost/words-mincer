<template>
  <div class="page-content">
    <template v-if="answers">
      <div
        v-for="(answer, key) in answers"
        :key="key"
        class="answers">
        <ul class="answer-inputs">
          <li
            v-for="(letter, index) in answer.answer.split('')"
            :key="index">
            <input
              :value="answer.helpers[index]"
              :placeholder="answer.answer[index]"
              maxlength="1"
              type="text"
              class="answer-input"
              disabled>
          </li>
        </ul>
      </div>
    </template>
    <div>
      <input
        v-model="input"
        type="text"
        class="answers-input"
        @input="validateInput()"
        @keyup.enter="checkInput()">
    </div>
    <div
      class="task"
      @mousedown="startDraw($event)"
      @touchstart="startDraw($event)"
      @mousemove="draw($event)"
      @touchmove="draw($event)"
      @mouseup="endDraw($event)"
      @touchend="endDraw($event)">
      <svg class="task-canvas">
        <path
          :d="d"
          stroke="red"
          fill="none"
          class="task-canvas-path"/>
      </svg>
      <ul
        :class="'task-list-' + task.length"
        class="task-list">
        <li
          v-for="(letter, key) in shuffledTask"
          :key="key"
          class="task-letter">
          <span>{{ letter }}</span>
        </li>
      </ul>
    </div>
    <ul class="helpers">
      <li>
        <button
          type="button"
          @click="openFirstLeters()">openFirstLeters {{ user.helpers.openFirstLeters.count }}</button>
      </li>
      <li>
        <button
          type="button"
          @click="openLastLeters()">openLastLeters {{ user.helpers.openLastLeters.count }}</button>
      </li>
      <li>
        <button
          type="button"
          @click="bomb()">bomb {{ user.helpers.bomb.count }}</button>
      </li>
    </ul>
    <hr style="margin:10px 0;">
    <div class="counterdown">
      <h3 class="counterdown-title">Таймер:</h3>
      <div class="counterdown">{{ formatTime(counterdown.time) }}</div>
    </div>
    <hr style="margin:10px 0;">
    <div class="treasure">
      <h3 class="treasure-title">Копилка:</h3>
      <ul class="treasure-list">
        <li
          v-for="(word, key) in treasure"
          :key="key">
          <div><b>{{ word }}</b></div>
          <div :html="descriptions[word]"/>
        </li>
      </ul>
    </div>
    <hr style="margin:10px 0;">
    <div class="solutions">
      <h3 class="solutions-title">Решено:</h3>
      <ul class="treasure-list">
        <li
          v-for="(word, key) in solutions"
          :key="key">
          <div><b>{{ word }}</b></div>
          <div><small>{{ descriptions[word] }}</small></div>
        </li>
      </ul>
    </div>
    <hr style="margin:10px 0;">
    <div class="strike">
      <h3 class="strike-title">Страйк:</h3>
      {{ strike }}
    </div>
    <hr style="margin:10px 0;">
    <div class="coins">
      <h3 class="coins-title">Монеты:</h3>
      {{ coins }}
    </div>
  </div>
</template>

<script>
// import AnswerInput from '../components/AnswerInput.vue'
import Task from '../js/task.js'
import Helpers from '../js/helpers.js'
import moment from 'moment'

export default {
  components: {
    // AnswerInput
  },
  data () {
    return {
      config: this.$root.config,
      words: this.$root.wordsRu,
      levels: this.$root.levels,
      user: this.$root.userData,
      treasure: [],
      solutions: [],
      answersCount: 0,
      strike: 0,
      coins: 0,
      input: '',
      answerLetters: [],
      d: '',
      isDraw: false,
      counterdown: {
        time: 0,
        coins: 0,
        timer: null
      }
    }
  },
  computed: {
    taskLevel () {
      return this.user.taskLevel
    },
    sublevels () {
      return this.levels[this.taskLevel].sublevels[this.user.taskSublevel]
    },
    wordLength () {
      return this.levels[this.taskLevel].wordLength
    },
    task () {
      // return Task.getTask(this.words[this.wordLength], this.taskLevel)
      return 'средая'
      // return 'грязь'
    },
    answersAll () {
      let minAnswerLength = +Object.keys(this.sublevels)[0]
      let maxAnswerLength = +Object.keys(this.sublevels)[Object.keys(this.sublevels).length - 1]
      let answersAll = {}
      for (let index = minAnswerLength; index <= maxAnswerLength; index++) {
        let words = this.words[index]
        let answers = Task.getAnswersAll(words, this.task)
        answersAll[index] = answers
      }
      return answersAll
    },
    answers () {
      return Task.getAnswers(this.answersAll, this.sublevels)
    },
    descriptions () {
      let descriptions = {}
      Object.keys(this.answersAll).forEach(key => {
        let answersAll = this.answersAll[key]
        if (!answersAll.length) return
        answersAll.forEach(el => {
          let word = this.words[el.length][el]
          if (word) descriptions[el] = word
        })
      })
      return descriptions
    },
    shuffledTask () {
      return this.task.split('').sort(() => { return 0.5 - Math.random() })
    }
  },
  mounted: function () {
    this.strike = this.user.strike
    this.coins = this.user.coins
    Object.keys(this.config.counterdown).forEach(el => {
      let counterdown = this.config.counterdown[el]
      if (!counterdown) return
      if (counterdown.levels.indexOf(this.taskLevel) !== -1) {
        this.counterdown.time = counterdown.time
        this.counterdown.coins = counterdown.coins
      }
    })
    this.updateCounterdown()
  },
  methods: {
    declOfNum (number, titles) {
      let cases = [2, 0, 1, 1, 1, 2]
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
    },
    openFirstLeters () {
      let helper = Helpers.openFirstLeters.bind(this)
      helper()
      this.user.common.helpers.openFirstLeters++
      this.checkHelpers()
    },
    openLastLeters () {
      let helper = Helpers.openLastLeters.bind(this)
      helper()
      this.user.common.helpers.openLastLeters++
      this.checkHelpers()
    },
    bomb () {
      let helper = Helpers.bomb.bind(this)
      helper()
      this.user.common.helpers.bomb++
      this.checkHelpers()
    },
    openNothing (helper) {
      console.log('openNothing ' + helper)
    },
    finishHelper (helper) {
      console.log('finishHelper ' + helper)
    },
    addToTreasure (word) {
      if (this.treasure.indexOf(word) === -1) {
        this.treasure.push(word)
        this.addCoins(1)
        this.addStrike()
        this.counterdown.time += 5
      }
    },
    addStrike () {
      this.strike++
      Object.keys(this.config.strike).forEach(el => {
        let strike = this.config.strike[el]
        if (!strike) return
        if (strike.levels.indexOf(this.taskLevel) !== -1) {
          if (strike.words === this.strike) {
            this.addCoins(strike.coins)
            this.resetStrike('done')
          }
        }
      })
    },
    resetStrike (type) {
      if (type === 'done') {
        console.log('strike done')
        this.user.common.strike++
      } else {
        console.log('strike loss')
      }
      this.strike = 0
    },
    addCoins (coins) {
      this.coins += coins
      this.user.common.score += coins
    },
    updateCounterdown (stop) {
      if (this.counterdown.timer === 0) return
      if (stop) {
        console.log('успел')
        clearInterval(this.counterdown.timer)
        return
      }
      this.counterdown.timer = setInterval(() => {
        this.counterdown.time--
        if (this.counterdown.time === 0) {
          console.log('не успел')
          clearInterval(this.counterdown.timer)
        }
      }, 1000)
    },
    formatTime (seconds) {
      return moment.utc(seconds * 1000).format('mm:ss')
    },
    startDraw (event) {
      let span = event.target
      if (span.tagName !== 'SPAN') return
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
    },
    draw (event) {
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
      if (!this.isDraw) return
      if (target.tagName === 'SPAN') {
        if (!target.classList.contains('active')) {
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
    },
    endDraw (event) {
      document.querySelectorAll('.task span').forEach(el => {
        el.classList.remove('active')
      })
      document.querySelector('html').style.overflowY = 'auto'
      this.isDraw = false
      this.d = ''
      let answer = this.answerLetters.join('')
      this.answerLetters = []
      this.checkAnswer(answer)
    },
    checkAnswer (answer) {
      for (let index = 0; index < this.answers.length; index++) {
        let el = this.answers[index]
        if (el.answer === answer) {
          this.answers[index].helpers = answer.split('')
          if (this.solutions.indexOf(answer) === -1) this.solutions.push(answer)
          this.correct()
          return
        }
      }
      let countTaskWords = this.levels[this.user.taskLevel].sublevels[this.user.taskSublevel][answer.length]
      let countAnswersWords = 0
      this.solutions.forEach(el => {
        if (el.length === answer.length) countAnswersWords++
      })
      if (countAnswersWords === countTaskWords) {
        this.wrong()
        return
      }
      let isAnswered = false
      Object.keys(this.answersAll).forEach(key => {
        let answersAll = this.answersAll[key]
        if (!answersAll) return
        answersAll.forEach(el => {
          if (el === answer) {
            this.addToTreasure(answer)
            if (!isAnswered) isAnswered = true
          }
        })
      })
      if (!isAnswered) this.wrong()
    },
    checkHelpers () {
      this.answers.forEach(el => {
        let helpers = el.helpers
        let isDone = true
        for (let index = 0; index < helpers.length; index++) {
          const letter = helpers[index]
          if (!letter) {
            isDone = false
            break
          }
        }
        if (isDone) {
          let answer = helpers.join('')
          if (this.solutions.indexOf(answer) === -1) {
            this.solutions.push(answer)
            this.correct()
          }
        }
      })
    },
    wrong () {
      console.log('ошибочка...')
      this.resetStrike('loss')
    },
    correct () {
      this.answersCount++
      this.addStrike()
      if (this.answersCount === this.answers.length) {
        this.updateCounterdown('stop')
        console.log('done!')
      }
    },
    checkInput () {
      this.checkAnswer(this.input)
      this.input = ''
    },
    validateInput () {
      let res = /[^а-яА-ЯїЇєЄіІёЁ ]/g.exec(this.input)
      this.input = this.input.replace(res, '')
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.task{
  position:relative;
}
.task-canvas{
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  pointer-events:none;
}
.task-canvas-path{
  stroke-width:1px;
}
.task-list{
  width:200px;
  height:250px;
  display:flex;
  flex-wrap:wrap;
  justify-content:space-between;
  user-select:none;
  li{
    display:flex;
    flex-direction:column;
  }
  span{
    width:40px;
    height:40px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    border-radius:50%;
    cursor:pointer;
    border:solid 1px #ccc;
    background-color:#fff;
    position:relative;
    z-index:1;
  }
}
.task-list-6{
  li{
    &:nth-child(1){
      justify-content:flex-end;
      width:100%;
      align-items:center;
    }
    &:nth-child(2){
      width:50%;
    }
    &:nth-child(3){
      width:50%;
      align-items:flex-end;
    }
    &:nth-child(4){
      width:50%;
      justify-content:flex-end;
    }
    &:nth-child(5){
      width:50%;
      justify-content:flex-end;
      align-items:flex-end;
    }
    &:nth-child(6){
      width:100%;
      align-items:center;
    }
  }
}
.answer-inputs{
  display:flex;
  &.currect{
    pointer-events:none;
  }
}
.answer-input{
  width:30px;
  height:30px;
  text-align:center;
}
</style>
