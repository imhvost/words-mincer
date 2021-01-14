<template>
  <div>
    <div>
      Уровень {{ userData.taskLevel }} / {{ userData.taskSublevel }} <span v-if="isBonus">(бонусный)</span>
    </div>
    <div
      v-if="answers"
      class="answers">
      <div
        v-for="(answer, key) in answers"
        :key="key"
        class="answer">
        <ul class="answer-inputs">
          <li
            v-for="(letter, index) in answer.answer.split('')"
            :key="index">
            <!-- :placeholder="answer.answer[index]" -->
            <input
              :value="answer.helpers[index]"
              maxlength="1"
              type="text"
              class="answer-input"
              disabled>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="isDone">
      <br>
      Решено!
      <button
        style="padding:5px 15px;"
        @click="goToNextLevel()">Go!</button>
      <br>
      <div v-if="loading">loading...</div>
    </div>
    <div v-if="settings.input === 'input'">
      <input
        v-model="input"
        type="text"
        class="answers-input"
        @input="validateInput()"
        @keyup.enter="checkInput()">
    </div>
    <template v-if="settings.input === 'draw'">
      <div class="task-info">
        <button
          :class="isDraw ? 'active' : ''"
          class="press-enter-btn"
          disabled
          @click="endPressDraw($event)">
          {{ answerLetters.join('') }}
        </button>
      </div>
      <div
        class="task"
        @mousedown="startDraw($event)"
        @touchstart="startDraw($event)"
        @mousemove.prevent="draw($event)"
        @touchmove.prevent="draw($event)"
        @mouseup="endDraw($event)"
        @touchend="endDraw($event)">
        <div
          v-if="isDraw"
          class="task-cancel">Сбросить</div>
        <svg class="task-canvas">
          <path
            :d="d"
            stroke="orange"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
            class="task-canvas-path"/>
        </svg>
        <ul
          :class="['task-list-' + task.length, taskListClass]"
          class="task-list">
          <li
            v-for="(letter, key) in shuffledTask"
            :key="key">
            <span class="task-letter">{{ letter }}</span>
          </li>
        </ul>
      </div>
    </template>
    <template v-if="settings.input === 'press'">
      <div class="task-info">
        <button
          :class="isDraw ? 'active' : ''"
          class="press-enter-btn"
          @click="endPressDraw($event)">
          {{ answerLetters.join('') }}
        </button>
      </div>
      <div class="task">
        <button
          v-if="isDraw"
          class="task-cancel"
          @click="endPressDraw($event, true)">Сбросить</button>
        <svg class="task-canvas">
          <path
            :d="d"
            stroke="orange"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
            class="task-canvas-path"/>
        </svg>
        <ul
          :class="['task-list-' + task.length, taskListClass]"
          class="task-list">
          <li
            v-for="(letter, key) in shuffledTask"
            :key="key">
            <span
              class="task-letter"
              @click="pressLetter($event)">{{ letter }}</span>
          </li>
        </ul>
      </div>
    </template>
    <div v-if="isBonus && !isDone">
      <button
        style="padding:5px 15px;margin:10px 0;"
        @click="skipLevel()">Пропустить</button>
    </div>
    <ul class="helpers">
      <template v-if="!isBonus">
        <li>
          <button
            type="button"
            @click="openFirstLetters()">Открывашка (ур.{{ userData.helpers.openFirstLetters.level }}) {{ userData.helpers.openFirstLetters.count }}</button>
        </li>
        <li>
          <button
            type="button"
            @click="openLastLetters()">Штопор (ур.{{ userData.helpers.openLastLetters.level }}) {{ userData.helpers.openLastLetters.count }}</button>
        </li>
        <li>
          <button
            type="button"
            @click="bomb()">Бомба (ур.{{ userData.helpers.bomb.level }}) {{ userData.helpers.bomb.count }}</button>
        </li>
      </template>
      <li>
        <button
          type="button"
          @click="isOpenShop = !isOpenShop">Магазин</button>
      </li>
      <li>
        <button
          type="button"
          @click="sidebareClass = sidebareClass ? '' : 'active'">Открыть слова</button>
      </li>
    </ul>
    <div
      v-if="isOpenShop"
      class="shop">
      <shop/>
    </div>
    <hr style="margin:10px 0;">
    <ul class="info-list">
      <li>
        <div class="counterdown">
          <h3 class="counterdown-title">Таймер:</h3>
          <div class="counterdown">{{ counterdown.time }}</div>
        </div>
      </li>
      <li>
        <div class="strike">
          <h3 class="strike-title">Страйк:</h3>
          {{ userData.strike }} / {{ strike }}
        </div>
      </li>
      <li>
        <div class="coins">
          <h3 class="coins-title">Монеты:</h3>
          {{ userData.coins }}
        </div>
      </li>
    </ul>
    <div :class="['game-sidebar', sidebareClass]">
      <button
        style="margin-bottom:20px;"
        @click="sidebareClass=''">Закрыть</button>
      <ul class="game-sidebar-nav">
        <li :class="[sidebarTabActive === 1 ? 'active' : '']">
          <button @click="sidebarTabActive = 1" >Копилка</button>
        </li>
        <li :class="[sidebarTabActive === 2 ? 'active' : '']">
          <button @click="sidebarTabActive = 2">Решено</button>
        </li>
        <li :class="[sidebarTabActive === 3 ? 'active' : '']">
          <button @click="sidebarTabActive = 3">Добавить в словарь</button>
        </li>
      </ul>
      <div class="game-sidebar-tabs">
        <game-sidebar-tab
          v-if="sidebarTabActive === 1"
          :title="'Копилка:'"
          :words="treasure"
          :descriptions="descriptions"
        />
        <game-sidebar-tab
          v-if="sidebarTabActive === 2"
          :title="'Решено:'"
          :words="solutions"
          :descriptions="descriptions"
        />
        <game-sidebar-tab
          v-if="sidebarTabActive === 3"
          :title="'Добавить в словарь:'"
          :words="mistakes"
          :mistakes="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GameSidebarTab from '../components/GameSidebarTab.vue'
import Shop from '../components/Shop.vue'
import Task from '../js/task.js'
import Helpers from '../js/helpers.js'
import Draw from '../js/draw.js'
// import moment from 'moment'
import {mapState} from 'vuex'

// const gameData = Func.getGameData()

export default {
  components: {
    GameSidebarTab,
    Shop
  },
  data () {
    return {
      treasure: [],
      solutions: [],
      mistakes: [],
      answersCount: 0,
      input: '',
      answerLetters: [],
      d: '',
      isDraw: false,
      counterdown: {
        time: 0,
        coins: 0,
        timer: null
      },
      time: 0,
      isDone: false,
      endGame: false,
      isOpenShop: false,
      sidebarTabActive: 1,
      loading: false,
      sidebareClass: '',
      taskListClass: '',
      audio: new Audio()
    }
  },
  computed: {
    ...mapState(['config', 'words', 'levels', 'user', 'settings']),
    userData () {
      return this.$store.state.userData[this.user.id][this.settings.lang]
    },
    taskLevel () {
      return this.userData.taskLevel
    },
    sublevels () {
      return this.levels[this.taskLevel][this.userData.taskSublevel].answers
    },
    wordLength () {
      return this.levels[this.taskLevel][this.userData.taskSublevel].wordLength
    },
    task () {
      if (this.$store.state.task) return this.$store.state.task
      let task = Task.getTask(this.words[this.wordLength], this.taskLevel)
      this.$store.commit('SET_TASK', task)
      return task
      // return 'сиусапиваeа'
      // return 'ааесрлн'
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
      // let answers = Task.getAnswersAll(this.words[4], this.task)
      // answersAll[4] = answers
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
      if (this.$store.state.shuffledTask.length) return this.$store.state.shuffledTask
      let shuffledTask = this.task.split('').sort(() => { return 0.5 - Math.random() })
      this.$store.commit('SET_SHUFFLED_TASK', shuffledTask)
      return shuffledTask
    },
    strike () {
      let strikeLength
      Object.keys(this.config.strike).forEach(el => {
        let strike = this.config.strike[el]
        if (!strike) return
        if (strike.levels.indexOf(this.taskLevel) !== -1) {
          strikeLength = strike.words
        }
      })
      return strikeLength
    },
    isBonus () {
      return this.levels[this.taskLevel][this.userData.taskSublevel].isBonus
    }
  },
  mounted: function () {
    this.startCounterdown()
    this.time = +new Date()
    if (location.port !== '8080') {
      window.onbeforeunload = (event) => {
        let dialogText = 'Обновить страницу?'
        event.returnValue = dialogText
        return dialogText
      }
    }
    window.addEventListener('unload', () => {
      this.$store.commit('SET_USER_DATA_LANG', {
        id: [this.user.id],
        data: this.userData,
        lang: this.settings.lang
      })
      this.$store.commit('SET_CURRENT_COUNTERDOWN', this.counterdown.time)
    })
  },
  beforeRouteLeave (to, from, next) {
    let result = confirm('Покинуть страницу?')
    if (result) {
      this.$store.commit('SET_USER_DATA_LANG', {
        id: [this.user.id],
        data: this.userData,
        lang: this.settings.lang
      })
      this.$store.commit('SET_CURRENT_COUNTERDOWN', this.counterdown.time)
      next()
    } else {
      next(false)
    }
  },
  methods: {
    startCounterdown () {
      Object.keys(this.config.counterdown).forEach(el => {
        let counterdown = this.config.counterdown[el]
        if (!counterdown) return
        if (counterdown.levels.indexOf(this.taskLevel) !== -1) {
          this.counterdown.time = counterdown.time
          this.counterdown.coins = counterdown.coins
        }
      })
      if (this.$store.state.currentCounterdown !== false) {
        this.counterdown.time = this.$store.state.currentCounterdown
      }
      this.updateCounterdown()
    },
    declOfNum (number, titles) {
      let cases = [2, 0, 1, 1, 1, 2]
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
    },
    openFirstLetters () {
      let helper = Helpers.openFirstLetters.bind(this)
      helper()
      this.userData.common.helpers.openFirstLetters++
      this.checkHelpers()
    },
    openLastLetters () {
      let helper = Helpers.openLastLetters.bind(this)
      helper()
      this.userData.common.helpers.openLastLetters++
      this.checkHelpers()
    },
    bomb () {
      let helper = Helpers.bomb.bind(this)
      helper()
      this.userData.common.helpers.bomb++
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
        this.playAudio('./static/audio/treasure.mp3')
        this.treasure.push(word)
        this.addCoins(this.config.coins[word.length])
        this.addStrike()
        this.userData.common.treasure++
        if (this.counterdown.time) this.counterdown.time += 5
        this.taskListClass = 'treasure'
        setTimeout(() => {
          this.taskListClass = ''
        }, 400)
      }
    },
    addStrike () {
      this.userData.strike++
      Object.keys(this.config.strike).forEach(el => {
        let strike = this.config.strike[el]
        if (!strike) return
        if (strike.levels.indexOf(this.taskLevel) !== -1) {
          if (strike.words === this.userData.strike) {
            this.playAudio('./static/audio/strike.mp3')
            this.addCoins(strike.coins)
            this.resetStrike('done')
          }
        }
      })
    },
    resetStrike (type) {
      if (type === 'done') {
        console.log('strike done')
        this.userData.common.strike++
      } else {
        console.log('strike loss')
      }
      this.userData.strike = 0
    },
    addCoins (coins) {
      this.userData.coins += coins
      if (coins > 0) {
        this.userData.common.coins += coins
      }
    },
    updateCounterdown (stop) {
      if (this.counterdown.time === 0) return
      if (stop) {
        console.log('успел')
        clearInterval(this.counterdown.timer)
        this.addCoins(this.counterdown.coins)
        this.userData.common.counterdown++
        return
      }
      this.counterdown.timer = setInterval(() => {
        this.counterdown.time--
        if (this.counterdown.time === 0) {
          this.playAudio('./static/audio/endTime.mp3')
          console.log('не успел')
          clearInterval(this.counterdown.timer)
        }
      }, 1000)
    },
    startDraw (event) {
      let draw = Draw.startDraw.bind(this)
      draw(event)
    },
    draw (event) {
      let draw = Draw.draw.bind(this)
      draw(event)
    },
    endDraw (event) {
      let draw = Draw.endDraw.bind(this)
      draw(event)
    },
    checkAnswer (answer) {
      for (let index = 0; index < this.answers.length; index++) {
        let el = this.answers[index]
        if (el.answer === answer) {
          this.answers[index].helpers = answer.split('')
          if (this.solutions.indexOf(answer) === -1) {
            this.solutions.push(answer)
            this.correct(answer)
            // правильный ответ
            return
          } else {
            // уже отгадано
            return
          }
        }
      }
      let countTaskWords = this.levels[this.userData.taskLevel][this.userData.taskSublevel].answers[answer.length]
      let countAnswersWords = 0
      this.solutions.forEach(el => {
        if (el.length === answer.length) countAnswersWords++
      })
      let isAnswered = false
      Object.keys(this.answersAll).forEach(key => {
        let answersAll = this.answersAll[key]
        answersAll.forEach(el => {
          if (el === answer) {
            if (countAnswersWords !== countTaskWords) {
              // в копилку
              this.addToTreasure(answer)
            }
            if (!isAnswered) isAnswered = true
          }
        })
      })
      if (countAnswersWords === countTaskWords) {
        if (!isAnswered) {
          this.wrong(answer, true)
        } else {
          this.wrong(answer)
        }
        return
      }
      if (!isAnswered) {
        this.wrong(answer, true)
      }
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
            this.correct(answer)
          }
        }
      })
    },
    wrong (word, mistake) {
      this.playAudio('./static/audio/error.mp3')
      this.userData.common.errors++
      this.resetStrike('loss')
      this.taskListClass = 'wrong'
      setTimeout(() => {
        this.taskListClass = ''
      }, 400)
      if (mistake) {
        if (this.mistakes.indexOf(word) === -1) {
          this.mistakes.push(word)
        }
      }
    },
    correct (answer) {
      this.answersCount++
      this.addStrike()
      this.addCoins(this.config.coins[answer.length])
      this.userData.common.answers++
      this.taskListClass = 'correct'
      setTimeout(() => {
        this.taskListClass = ''
      }, 400)
      if (this.answersCount === this.answers.length) {
        if (this.isBonus) this.userData.common.bonus++
        this.endLevel()
      } else {
        this.playAudio('./static/audio/correct.mp3')
      }
    },
    endLevel () {
      this.updateCounterdown('stop')
      this.$store.commit('SET_CURRENT_COUNTERDOWN', 0)
      this.userData.common.time += new Date() - this.time
      this.time = 0
      this.isDone = true
      this.playAudio('./static/audio/endLevel.mp3')
    },
    goToNextLevel () {
      this.loading = true
      setTimeout(() => {
        this.$store.commit('SET_TASK', '')
        this.$store.commit('SET_SHUFFLED_TASK', [])
        this.$store.commit('SET_CURRENT_COUNTERDOWN', false)
        let level = this.userData.taskLevel
        let sublevel = this.userData.taskSublevel
        if (this.levels[level][sublevel + 1]) {
          this.userData.taskSublevel++
        } else {
          if (this.levels[level + 1]) {
            this.userData.taskLevel++
            this.userData.taskSublevel = 1
          } else {
            this.endGame = true
            return
          }
        }
        let firebaseData = {
          userId: this.user.id,
          lang: this.settings.lang,
          props: {
            taskLevel: this.userData.taskLevel,
            taskSublevel: this.userData.taskSublevel,
            coins: this.userData.coins,
            strike: this.userData.strike,
            common: this.userData.common
          }
        }
        Object.assign(this.$data, this.$options.data())
        this.startCounterdown()
        this.time = +new Date()
        this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
      }, 200)
    },
    skipLevel () {
      this.playAudio('./static/audio/skipLevel.mp3')
      this.endLevel()
      this.answers.forEach((el, index) => {
        this.answers[index].helpers = el.answer.split('')
      })
    },
    checkInput () {
      this.checkAnswer(this.input)
      this.input = ''
    },
    validateInput () {
      let reg = new RegExp(`[^${this.task}]`, 'g')
      let res = reg.exec(this.input)
      this.input = this.input.replace(res, '')
    },
    pressLetter () {
      let draw = Draw.pressDraw.bind(this)
      draw(event)
    },
    endPressDraw (event, cancel) {
      let draw = Draw.endPressDraw.bind(this)
      draw(event, cancel)
    },
    playAudio (src) {
      if (this.settings.audio !== 'on') return
      this.audio = new Audio(src)
      this.audio.play()
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.answers{
  display:flex;
  flex-wrap:wrap;
  margin:0 -10px -5px;
}
.answer{
  padding:0 10px 5px;
  min-width:50%;
}
.task{
  position:relative;
  overflow:hidden;
  margin:0 -15px;
}
.task-cancel{
  position:absolute;
  width:150px;
  height:150px;
  right:-75px;
  top:-75px;
  border-radius:50%;
  background-color:#ffb5b5;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  align-items:center;
  padding:20px;
  transform:rotate(45deg);
  color:#fff;
  border:0;
}
.task-info{
  padding:10px 0;
  display:flex;
  flex-direction:column;
  align-items:center;
}
.press-enter-btn{
  padding:10px 20px;
  border:0;
  border-radius:~'43% 57% 43% 57% / 46% 39% 61% 54%';
  background-color:green;
  visibility:hidden;
  height:42px;
  color:#fff;
  &.active{
    visibility:visible;
  }
}
.task-canvas{
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  pointer-events:none;
}
.task-list{
  width:200px;
  height:250px;
  display:flex;
  flex-wrap:wrap;
  justify-content:space-between;
  user-select:none;
  margin:auto;
  li{
    display:flex;
    flex-direction:column;
    height:25%;
    &:nth-child(3n+1){
      span{
        border-radius:~'43% 57% 61% 39% / 48% 58% 42% 52% ';
      }
    }
    &:nth-child(3n){
      span{
        border-radius:~'65% 35% 46% 54% / 34% 46% 54% 66%';
      }
    }
  }
  span{
    width:50px;
    height:50px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    border-radius:~'37% 63% 43% 57% / 56% 43% 57% 44%';
    cursor:pointer;
    border:solid 1px #ccc;
    background-color:#fff;
    position:relative;
    z-index:1;
    font-size:1.5rem;
    font-weight:700;
    transition:.2s;
    &:before{
      content:'';
      position:absolute;
      left:-10px;
      right:-10px;
      top:-10px;
      bottom:-10px;
      pointer-events:none;
      opacity:0;
      transition:.2s;
      border-radius:inherit;
      transform:rotate(90deg);
      border:dashed 2px #ccc;
    }
    &.active{
      pointer-events:none;
      background-color:#eee;
      &:before{
        opacity:1;
      }
    }
  }
  &.treasure{
    span{
      background-color:blue;
      color:#fff;
    }
  }
  &.wrong{
    span{
      background-color:red;
      color:#fff;
    }
  }
  &.correct{
    span{
      background-color:green;
      color:#fff;
    }
  }
}
.task-list-5{
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
      align-items:center;
    }
    &:nth-child(5){
      width:50%;
      align-items:center;
    }
  }
}
.task-list-6{
  width:220px;
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
.task-list-7{
  width:250px;
  li{
    width:50%;
    &:nth-child(1){
      width:100%;
      align-items:center;
      justify-content:flex-end;
    }
    &:nth-child(2){
      padding-left:10px;
    }
    &:nth-child(3){
      align-items:flex-end;
      padding-right:10px;
    }
    &:nth-child(4){
      justify-content:center;
    }
    &:nth-child(5){
      align-items:flex-end;
      justify-content:center;
    }
    &:nth-child(6){
      align-items:center;
      padding-left:35px;
      justify-content:center;
    }
    &:nth-child(7){
      align-items:center;
      padding-right:35px;
      justify-content:center;
    }
  }
}
.task-list-8{
  width:250px;
  li{
    width:50%;
    justify-content:center;
    &:nth-child(1){
      justify-content:flex-end;
      align-items:center;
      padding-left:50px;
    }
    &:nth-child(2){
      justify-content:flex-end;
      align-items:center;
      padding-right:50px;
    }
    &:nth-child(3){
      justify-content:flex-end;
      padding-bottom:10px;
    }
    &:nth-child(4){
      align-items:flex-end;
      justify-content:flex-end;
      padding-bottom:10px;
    }
    &:nth-child(5){
      padding-top:10px;
    }
    &:nth-child(6){
      align-items:flex-end;
      padding-top:10px;
    }
    &:nth-child(7){
      align-items:center;
      padding-left:50px;
      padding-bottom:10px;
      justify-content:center;
    }
    &:nth-child(8){
      align-items:center;
      padding-right:50px;
      padding-bottom:10px;
      justify-content:center;
    }
  }
}
.task-list-9{
  width:250px;
  li{
    width:50%;
    justify-content:center;
    height:20%;
    &:nth-child(1){
      justify-content:flex-end;
      align-items:center;
      padding-left:50px;
    }
    &:nth-child(2){
      justify-content:flex-end;
      align-items:center;
      padding-right:50px;
    }
    &:nth-child(3){
      justify-content:flex-end;
    }
    &:nth-child(4){
      align-items:flex-end;
      justify-content:flex-end;
    }
    &:nth-child(6){
      align-items:flex-end;
    }
    &:nth-child(7){
      align-items:center;
      padding-left:10px;
      justify-content:center;
    }
    &:nth-child(8){
      align-items:center;
      padding-right:10px;
      justify-content:center;
    }
    &:nth-child(9){
      align-items:center;
      justify-content:center;
      width:100%;
    }
  }
}
.task-list-10{
  width:250px;
  li{
    width:50%;
    justify-content:center;
    height:20%;
    &:nth-child(1){
      justify-content:flex-end;
      align-items:center;
      padding-left:50px;
    }
    &:nth-child(2){
      justify-content:flex-end;
      align-items:center;
      padding-right:50px;
    }
    &:nth-child(3){
      justify-content:flex-end;
    }
    &:nth-child(4){
      align-items:flex-end;
      justify-content:flex-end;
    }
    &:nth-child(6){
      align-items:flex-end;
    }
    &:nth-child(7){
      justify-content:center;
    }
    &:nth-child(8){
      align-items:flex-end;
      justify-content:center;
    }
    &:nth-child(9){
      align-items:center;
    }
    &:nth-child(10){
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
.helpers{
  display:flex;
  margin:0 -5px;
  flex-wrap:wrap;
  li{
    padding:0 5px 10px;
  }
}
.shop-list{
  display:flex;
  margin:0 -5px;
  flex-wrap:wrap;
  li{
    padding:0 5px 10px;
  }
}
.info-list{
  display:flex;
  margin:0 -5px;
  li{
    padding:0 5px 10px;
  }
}
.game-sidebar{
  position:fixed;
  width:50%;
  min-width:290px;
  right:0;
  top:0;
  bottom:0;
  background-color:#fff;
  z-index:666;
  overflow-y:auto;
  box-shadow:-2px 0 20px rgba(0,0,0,.5);
  padding:20px 15px;
  transition:.4s;
  transform:translateX(100%);
  &.active{
    transform:translateX(0);
  }
}
.game-sidebar-nav{
  display:flex;
  margin:0 -5px;
  li{
    padding:0 5px 10px;
  }
}
</style>
