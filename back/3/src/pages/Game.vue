<template>
  <div class="page-game">
    <loading :loading="loading">{{ text.loading[lang] }}</loading>
    <div class="panel panel-top">
      <div class="container">
        <div class="panel-body">
          <div class="panel-block panel-block-level icon-block">
            <svg class="icon">
              <use xlink:href="#level"/>
            </svg>
            <div class="icon-desc">{{ userData.taskLevel }} / {{ userData.taskSublevel }}</div>
          </div>
          <div class="panel-block panel-block-time icon-block">
            <svg class="icon">
              <use xlink:href="#time"/>
            </svg>
            <div class="icon-desc">{{ counterdown.time }}</div>
            <div
              :class="panelInfo.time.className ? panelInfo.time.className + ' active' : ''"
              class="panel-info">{{ panelInfo.time.text }}</div>
          </div>
          <div class="panel-block icon-block">
            <svg class="icon">
              <use xlink:href="#strike"/>
            </svg>
            <div class="icon-desc">{{ userData.strike }} / {{ strike }}</div>
            <div
              :class="panelInfo.strike.className ? panelInfo.strike.className + ' active' : ''"
              class="panel-info">{{ panelInfo.strike.text }}</div>
          </div>
          <div class="panel-block icon-block">
            <svg class="icon">
              <use xlink:href="#coins"/>
            </svg>
            <div class="icon-desc">{{ userData.coins }}</div>
            <div
              :class="panelInfo.coins.className ? panelInfo.coins.className + ' active' : ''"
              class="panel-info">{{ panelInfo.coins.text }}</div>
          </div>
          <button
            type="button"
            aria-label="Open shop"
            class="panel-btn"
            @click="openModal('shop')">
            <svg class="icon">
              <use xlink:href="#shop"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="game-body">
      <div class="container">
        <div
          v-if="answers"
          class="answers">
          <div
            v-for="(answer, key) in answers"
            :key="key"
            :class="'answer answer-' + answers.length">
            <ul class="answer-inputs">
              <li
                v-for="(letter, index) in answer.answer.split('')"
                :key="index">
                <!-- :placeholder="answer.answer[index]" -->
                <label>
                  <input
                    :value="answer.helpers[index]"
                    maxlength="1"
                    type="text"
                    class="answer-input"
                    disabled>
                </label>
              </li>
            </ul>
          </div>
        </div>
        <div
          v-if="settings.input === 'input'"
          class="input-wrapp">
          <label>
            <input
              v-model="input"
              :placeholder="text.inputPlaceholder[lang]"
              type="text"
              class="answers-input"
              @input="validateInput()"
              @keyup.enter="checkInput()">
          </label>
        </div>
        <template v-if="settings.input === 'draw'">
          <div class="task-info">
            <button
              :class="isDraw ? 'active' : ''"
              class="press-enter-btn"
              type="button"
              aria-label="Entered answer"
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
              class="task-cancel-wrapp">
              <div
                v-if="isDraw"
                class="task-cancel">{{ text.cancel[lang] }}</div>
            </div>
            <svg class="task-canvas">
              <path
                :d="d"
                stroke="orange"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"
                class="task-canvas-path"/>
            </svg>
            <!-- <canvas class="task-canvas"/> -->
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
              aria-label="Entered answer"
              type="button"
              @click="endPressDraw($event)">
              {{ answerLetters.join('') }}
            </button>
          </div>
          <div class="task">
            <div
              v-if="isDraw"
              class="task-cancel-wrapp">
              <button
                type="button"
                class="task-cancel"
                aria-label="Cancel answer"
                @click="endPressDraw($event, true)">{{ text.cancel[lang] }}</button>
            </div>
            <svg class="task-canvas">
              <path
                :d="d"
                stroke="orange"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"
                class="task-canvas-path"/>
            </svg>
            <!-- <canvas class="task-canvas"/> -->
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
      </div>
    </div>
    <div class="panel panel-bottom">
      <div class="container">
        <div class="panel-body">
          <button
            type="button"
            class="panel-btn"
            aria-label="Open solutions"
            @click="openModal('solutions')">
            <svg class="icon">
              <use xlink:href="#correct"/>
            </svg>
            <div class="panel-btn-count">{{ solutions.length || 0 }}</div>
          </button>
          <button
            type="button"
            class="panel-btn"
            aria-label="Open treasure"
            @click="openModal('treasure')">
            <svg class="icon">
              <use xlink:href="#treasure"/>
            </svg>
            <div class="panel-btn-count">{{ treasure.length || 0 }}</div>
            <div
              :class="panelInfo.treasure.className ? panelInfo.treasure.className + ' active' : ''"
              class="panel-info panel-info-bottom">{{ panelInfo.treasure.text }}</div>
          </button>
          <button
            type="button"
            class="panel-btn panel-btn-mistakes"
            aria-label="Open mistakes"
            @click="openModal('mistakes')">
            <svg class="icon">
              <use xlink:href="#errors"/>
            </svg>
            <div class="panel-btn-count">{{ mistakes.length || 0 }}</div>
            <div
              :class="panelInfo.mistakes.className ? panelInfo.mistakes.className + ' active' : ''"
              class="panel-info panel-info-bottom">{{ panelInfo.mistakes.text }}</div>
          </button>
          <template v-if="!isBonus">
            <button
              type="button"
              class="panel-btn"
              aria-label="Open first letters"
              @click="openFirstLetters()">
              <svg class="icon">
                <use xlink:href="#openFirstLetters"/>
              </svg>
              <div class="panel-btn-count panel-btn-count-right">{{ userData.helpers.openFirstLetters.count }}</div>
              <div
                :class="panelInfo.openFirstLetters.className ? panelInfo.openFirstLetters.className + ' active' : ''"
                class="panel-info panel-info-bottom">{{ panelInfo.openFirstLetters.text }}</div>
            </button>
            <button
              type="button"
              class="panel-btn"
              aria-label="Open last letters"
              @click="openLastLetters()">
              <svg class="icon">
                <use xlink:href="#openLastLetters"/>
              </svg>
              <div class="panel-btn-count panel-btn-count-right">{{ userData.helpers.openLastLetters.count }}</div>
              <div
                :class="panelInfo.openLastLetters.className ? panelInfo.openLastLetters.className + ' active' : ''"
                class="panel-info panel-info-bottom">{{ panelInfo.openLastLetters.text }}</div>
            </button>
            <button
              type="button"
              class="panel-btn"
              aria-label="Throw a bomb"
              @click="bomb()">
              <svg class="icon">
                <use xlink:href="#bomb"/>
              </svg>
              <div class="panel-btn-count panel-btn-count-right">{{ userData.helpers.bomb.count }}</div>
              <div
                :class="panelInfo.bomb.className ? panelInfo.bomb.className + ' active' : ''"
                class="panel-info panel-info-bottom">{{ panelInfo.bomb.text }}</div>
            </button>
          </template>
          <template v-else>
            <div v-if="!isDone">
              <button
                type="button"
                class="panel-btn panel-btn-skip"
                aria-label="Skip level"
                @click="skipLevel()">
                <span class="panel-btn-skip-desc">{{ text.skip[lang] }}</span>
                <svg class="icon">
                  <use xlink:href="#skip"/>
                </svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="isDone"
      class="level-done">
      <div class="level-done-body">
        <div class="container">
          <div
            v-if="skipeddLevel"
            class="level-done-title">{{ text.endTitleSkip[lang] }}</div>
          <div
            v-else
            class="level-done-title">{{ text.endTitle[lang] }}</div>
          <ul
            :class="solutions.length > 1 ? 'level-done-answers-columns' : ''"
            class="level-done-answers">
            <li
              v-for="(word, index) in solutions"
              :key="index">{{ word }}</li>
          </ul>
          <ul class="level-done-list">
            <li>
              <button
                type="button"
                class="level-done-btn"
                aria-label="Save and exit"
                @click="goToNextLevel('saveAndExit')">
                <span>{{ text.saveAndExit[lang] }}</span>
                <svg class="icon">
                  <use xlink:href="#save"/>
                </svg>
              </button>
            </li>
            <li>
              <button
                type="button"
                class="level-done-btn"
                aria-label="Go to next level"
                @click="goToNextLevel()">
                <span>{{ text.continue[lang] }}</span>
                <svg class="icon">
                  <use xlink:href="#skip"/>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <share/>
    </div>
    <modal
      :is-open="modalOpen.treasure"
      :title="text.modalTitles.treasure[lang]"
      :words="treasure"
      :descriptions="descriptions"
      :type="'words'"
      @close="modalOpen.treasure = false"
    />
    <modal
      :is-open="modalOpen.solutions"
      :title="text.modalTitles.solutions[lang]"
      :words="solutions"
      :descriptions="descriptions"
      :type="'words'"
      @close="modalOpen.solutions = false"
    />
    <modal
      :is-open="modalOpen.mistakes"
      :title="text.modalTitles.mistakes[lang]"
      :words="mistakes"
      :type="'mistakes'"
      @close="modalOpen.mistakes = false"
      @add="addWord()"
    />
    <modal
      :is-open="modalOpen.shop"
      :title="text.modalTitles.shop[lang]"
      :type="'shop'"
      @close="modalOpen.shop = false"
      @add-award="addAward($event)"
    />
    <modal
      :is-open="modalOpen.endGame"
      :title="text.modalTitles.endGame[lang]"
      :type="'endGame'"
      :score="endGame"
      @close="modalOpen.endGame = false"
      @start="startNewGame()"
    />
    <modal
      v-if="modalAwards.length"
      :is-open="modalOpen.awards"
      :title="modalAwards.length === 1 ? text.modalTitles.awards[0][lang] : text.modalTitles.awards[1][lang]"
      :type="'awards'"
      :awards="modalAwards"
      @close="modalOpen.award = false; modalAwards = []"
    />
  </div>
</template>

<script>
import Modal from '../components/Modal.vue'
import Loading from '../components/Loading.vue'
import Task from '../js/task.js'
import Helpers from '../js/helpers.js'
import Draw from '../js/draw.js'
import {mapState} from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import Worker from '../js/next-level.worker.js'
import Share from '../components/Share.vue'
import userConfig from '../data/user.json'

// const gameData = Func.getGameData()

export default {
  components: {
    Modal,
    Loading,
    Share
  },
  data () {
    return {
      userConfig: userConfig,
      treasure: [],
      solutions: [],
      mistakes: [],
      answersCount: 0,
      input: '',
      answerLetters: [],
      d: '',
      isDraw: false,
      // canvasLines: [],
      counterdown: {
        time: 0,
        coins: 0,
        timer: null
      },
      time: 0,
      isDone: false,
      endGame: 0,
      modalOpen: {
        treasure: false,
        solutions: false,
        mistakes: false,
        shop: false,
        awards: false,
        endGame: false
      },
      loading: false,
      sidebareClass: '',
      taskListClass: '',
      skipeddLevel: false,
      saveAndExit: false,
      modalAwards: [],
      panelInfo: {
        coins: {
          count: 0
        },
        strike: {},
        time: {},
        treasure: {},
        mistakes: {},
        openFirstLetters: {},
        openLastLetters: {},
        bomb: {}
      }
    }
  },
  computed: {
    ...mapState(['game', 'config', 'words', 'levels', 'user', 'settings', 'awardsList']),
    userData () {
      return this.$store.state.userData[this.user.id][this.settings.lang]
    },
    awards () {
      return this.$store.state.userData[this.user.id].awards
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
      // return 'сиусапивафыффапу'
      if (this.$store.state.task) {
        return decodeURIComponent(atob(this.$store.state.task))
      }
      let task = Task.getTask(this.words[this.wordLength], this.taskLevel)
      this.$store.commit('SET_TASK', task)
      return task
    },
    answersAll () {
      let cashAnswers = this.$store.state.answersAll
      if (cashAnswers) {
        let answers = {}
        Object.keys(cashAnswers).forEach(key => {
          let decodedAnswers = cashAnswers[key].map(el => decodeURIComponent(atob(el)))
          answers[key] = decodedAnswers
        })
        return answers
      }
      let minAnswerLength = +Object.keys(this.sublevels)[0]
      let maxAnswerLength = +Object.keys(this.sublevels)[Object.keys(this.sublevels).length - 1]
      let answersAll = {}
      for (let index = minAnswerLength; index <= maxAnswerLength; index++) {
        let words = this.words[index]
        let answers = Task.getAnswersAll(words, this.task)
        answersAll[index] = answers
      }
      this.$store.commit('SET_ANSWERS_ALL', answersAll)
      // let answers = Task.getAnswersAll(this.words[4], this.task)
      // answersAll[4] = answers
      return answersAll
    },
    answers () {
      let cashAnswers = this.$store.state.answers
      let cashHelpers = this.$store.state.helpers
      if (cashAnswers.length && cashHelpers.length) {
        let answers = []
        cashAnswers.forEach((el, index) => {
          answers.push({
            answer: decodeURIComponent(atob(el)),
            helpers: cashHelpers[index]
          })
        })
        return answers
      }
      let answers = Task.getAnswers(this.answersAll, this.sublevels)
      this.$store.commit('SET_ANSWERS', answers)
      return answers
    },
    descriptions () {
      let descriptions = {}
      Object.keys(this.answersAll).forEach(key => {
        let answersAll = this.answersAll[key]
        if (!answersAll.length) return
        answersAll.forEach(el => {
          let word = this.words[el.length][el]
          if (word) descriptions[el] = word.replace(/#/g, '<p>')
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
    },
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.page.game
    }
  },
  mounted: function () {
    this.getNextLevel()
    if (this.$store.state.game) {
      Object.assign(this.$data, this.$store.state.game)
      if (this.$store.state.game.skipeddLevel) {
        if (this.isDone) return
        this.goToNextLevel()
        this.$store.commit('SET_GAME_PROPS', {
          skipeddLevel: false
        })
      }
    }
    if (this.$store.state.loadingUser) {
      this.$router.push('home')
      return
    }
    if (this.counterdown.timer === null) {
      this.startCounterdown()
    } else {
      this.updateCounterdown()
    }
    this.time = +new Date()
    if (location.port !== '8080') {
      //
    }
    window.onbeforeunload = (event) => {
      // this.$store.commit('SET_CURRENT_COUNTERDOWN', this.counterdown.time)
      // let dialogText = this.text.refresh[this.lang]
      // event.returnValue = dialogText
      // return dialogText
      // if (this.skipeddLevel) this.goToNextLevel('skipedd')
      // this.skipeddLevel = false
      // this.$store.commit('SET_GAME', this.$data)
      // this.$store.commit('SET_ANSWERS', this.answers)
    }
    window.onunload = () => {
      // if (this.skipeddLevel) this.goToNextLevel('skipedd')
      // this.skipeddLevel = false
      this.$store.commit('SET_GAME', this.$data)
      this.$store.commit('SET_ANSWERS', this.answers)
      // this.$store.commit('SET_GAME_PROPS', {
      //   time: 0
      // })
      // this.$store.commit('EXIT_GAME')
    }
  },
  beforeRouteLeave (to, from, next) {
    let modals = Object.keys(this.modalOpen)
    for (let i = 0; i < modals.length; i++) {
      let element = modals[i]
      if (this.modalOpen[element]) {
        this.modalOpen[element] = false
        next(false)
        this.$root.playAudio('click')
        return
      }
    }
    // if (this.saveAndExit || this.$store.state.loadingUser) {
    //   next()
    //   return
    // }
    // if (this.skipeddLevel) this.goToNextLevel('skipedd')
    // this.skipeddLevel = false
    this.$store.commit('SET_GAME', this.$data)
    this.$store.commit('SET_ANSWERS', this.answers)
    next()
    // let result = confirm(this.text.leave[this.lang])
    // if (result) {
    //   if (this.skipeddLevel) this.goToNextLevel('skipedd')
    //   this.$store.commit('SET_GAME', this.$data)
    //   this.$store.commit('SET_ANSWERS', this.answers)
    //   next()
    // } else {
    //   next(false)
    // }
  },
  methods: {
    getNextLevel () {
      this.$store.commit('NEXT_LEVEL', {
        task: null,
        answersAll: null
      })
      let level = this.userData.taskLevel
      let sublevel = this.userData.taskSublevel
      if (this.levels[level][sublevel + 1]) {
        sublevel++
      } else {
        if (this.levels[level + 1]) {
          level++
          sublevel = 1
        }
      }
      let wordLength = this.levels[level][sublevel].wordLength
      let sublevels = this.levels[level][sublevel].answers
      let minAnswerLength = +Object.keys(sublevels)[0]
      let maxAnswerLength = +Object.keys(sublevels)[Object.keys(sublevels).length - 1]
      let workerSetting = {
        task: [this.words[wordLength], level],
        answersAll: [minAnswerLength, maxAnswerLength, this.words]
      }
      let myWorker = new Worker()
      myWorker.postMessage(workerSetting)
      myWorker.onmessage = (e) => {
        // console.log(e.data.task)
        // console.log(e.data.answersAll)
        this.$store.commit('NEXT_LEVEL', {task: e.data.task})
        this.$store.commit('NEXT_LEVEL', {answersAll: e.data.answersAll})
      }
    },
    openFirstLetters () {
      let helper = Helpers.openFirstLetters.bind(this)
      helper()
      this.userData.common.helpers.openFirstLetters++
      if (this.userData.common.helpers.openFirstLetters === 50) this.addAward('bartender')
      if (this.userData.common.helpers.openFirstLetters >= 50 && this.userData.common.helpers.openLastLetters >= 50) this.addAward('alcoholic')
      this.checkHelpers()
    },
    openLastLetters () {
      let helper = Helpers.openLastLetters.bind(this)
      helper()
      this.userData.common.helpers.openLastLetters++
      if (this.userData.common.helpers.openLastLetters === 50) this.addAward('enofil')
      if (this.userData.common.helpers.openFirstLetters >= 50 && this.userData.common.helpers.openLastLetters >= 50) this.addAward('alcoholic')
      this.checkHelpers()
    },
    bomb () {
      let helper = Helpers.bomb.bind(this)
      helper()
      this.userData.common.helpers.bomb++
      if (this.userData.common.helpers.bomb === 50) this.addAward('pirate')
      if (this.userData.common.helpers.bomb === 100) this.addAward('sparrow')
      this.checkHelpers()
    },
    openNothing (helper) {
      this.$root.playAudio('openNothing')
      // console.log(helper)
      this.panelInfo[helper].className = 'minus'
      this.panelInfo[helper].text = this.text.panelInfo.openNothing[this.lang]
      this.clearPanelInfo(helper)
    },
    finishHelper (helper) {
      this.$root.playAudio('openNothing')
      this.panelInfo[helper].className = 'minus'
      this.panelInfo[helper].text = this.text.panelInfo.openNothing[this.lang]
      this.clearPanelInfo(helper)
    },
    addToTreasure (word) {
      if (this.treasure.indexOf(word) === -1) {
        this.$root.playAudio('treasure')
        this.panelInfo.treasure.className = 'plus'
        this.panelInfo.treasure.text = this.text.panelInfo.treasure[this.lang]
        this.clearPanelInfo('treasure')
        this.treasure.push(word)
        this.addCoins(this.config.coins[word.length])
        this.addStrike()
        this.userData.common.treasure++
        if (this.userData.common.treasure >= 500) this.addAward('lucky')
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
            this.$root.playAudio('strike')
            this.addCoins(strike.coins)
            this.resetStrike('done')
          }
        }
      })
    },
    resetStrike (type) {
      if (type === 'done') {
        this.panelInfo.strike.text = this.text.panelInfo.strike[0][this.lang]
        this.panelInfo.strike.className = 'plus'
        this.awards.state.strike++
        if (this.awards.state.strike === 3) this.addAward('snooker')
        this.userData.common.strike++
      } else {
        if (this.userData.strike) {
          this.panelInfo.strike.text = this.text.panelInfo.strike[1][this.lang]
          this.panelInfo.strike.className = 'minus'
        }
        this.awards.state.strike = 0
      }
      this.userData.strike = 0
      this.clearPanelInfo('strike')
    },
    addCoins (coins) {
      this.userData.coins += coins
      this.panelInfo.coins.count += coins
      console.log(coins, this.panelInfo.coins.count)
      if (coins > 0) {
        this.panelInfo.coins.text = '+' + this.panelInfo.coins.count
        this.panelInfo.coins.className = 'plus'
        this.userData.common.coins += coins
        this.userData.history[this.userData.history.length - 1] += coins
        if (this.userData.common.coins >= 2000) this.addAward('hunky')
        if (this.userData.common.coins >= 5000) this.addAward('oligarch')
      } else {
        this.panelInfo.coins.text = '-' + this.panelInfo.coins.count
        this.panelInfo.coins.className = 'minus'
      }
      this.clearPanelInfo('coins')
    },
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
    updateCounterdown (stop) {
      if (this.counterdown.time <= 0) {
        this.counterdown.time = 0
        clearInterval(this.counterdown.timer)
        return
      }
      if (stop) {
        clearInterval(this.counterdown.timer)
        if (this.$store.state.loadingUser || this.skipeddLevel) return
        this.$root.playAudio('endLevelHaveTime')
        this.addCoins(this.counterdown.coins)
        this.panelInfo.time.text = this.text.panelInfo.time[0][this.lang]
        this.panelInfo.time.className = 'plus'
        this.clearPanelInfo('time')
        setTimeout(() => {
          this.panelInfo.coins.text = '+' + this.counterdown.coins
          this.panelInfo.coins.className = 'plus'
        }, 400)
        this.userData.common.counterdown++
        this.awards.state.time++
        if (this.awards.state.time === 3) this.addAward('hurry')
        return
      }
      clearInterval(this.counterdown.timer)
      this.counterdown.timer = setInterval(() => {
        this.counterdown.time--
        if (this.counterdown.time === 0) {
          this.$root.playAudio('endTime')
          this.awards.state.time = 0
          // console.log('не успел')
          this.panelInfo.time.text = this.text.panelInfo.time[1][this.lang]
          this.panelInfo.time.className = 'minus'
          this.clearPanelInfo('time')
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
      this.$root.playAudio('error')
      this.userData.common.errors++
      if (this.userData.common.errors === 500) this.addAward('dunce')
      this.resetStrike('loss')
      this.taskListClass = 'wrong'
      this.panelInfo.mistakes.className = 'minus'
      this.panelInfo.mistakes.text = this.text.panelInfo.mistakes[this.lang]
      this.clearPanelInfo('mistakes')
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
      if (this.userData.common.answers >= 1000) this.addAward('student')
      if (this.userData.common.answers >= 2000) this.addAward('professor')
      this.taskListClass = 'correct'
      setTimeout(() => {
        this.taskListClass = ''
      }, 400)
      if (this.answersCount === this.answers.length) {
        // console.log(this.answersCount, this.answers.length)
        if (this.isBonus) {
          this.userData.common.bonus++
        }
        this.endLevel()
      } else {
        this.$root.playAudio('correct')
      }
    },
    endLevel () {
      this.updateCounterdown('stop')
      // this.$store.commit('SET_CURRENT_COUNTERDOWN', 0)
      this.awards.state.reset = 0
      let time = new Date() - this.time
      this.userData.common.time += time
      if (time >= 300000) this.addAward('slowpoke')
      this.time = 0
      this.isDone = true
      if (!this.skipeddLevel) {
        this.$root.playAudio('endLevel')
        if (this.awards.state.input === false) {
          this.addAward('idler')
        } else {
          this.awards.state.input = false
        }
      }
    },
    goToNextLevel (type) {
      if (!type) this.loading = true
      setTimeout(() => {
        if (this.$store.state.nextLevel.task) {
          this.$store.commit('SET_TASK_ENCODE', this.$store.state.nextLevel.task)
        } else {
          this.$store.commit('SET_TASK', '')
        }
        this.$store.commit('SET_SHUFFLED_TASK', [])
        // this.$store.commit('SET_CURRENT_COUNTERDOWN', false)
        this.$store.commit('SET_GAME', null)
        if (this.$store.state.nextLevel.answersAll) {
          this.$store.commit('SET_ANSWERS_ALL_ENCODE', this.$store.state.nextLevel.answersAll)
        } else {
          this.$store.commit('SET_ANSWERS_ALL', null)
        }
        this.$store.commit('SET_ANSWERS', null)
        let level = this.userData.taskLevel
        let sublevel = this.userData.taskSublevel
        if (this.levels[level][sublevel + 1]) {
          this.userData.taskSublevel++
        } else {
          if (this.levels[level + 1]) {
            this.userData.taskLevel++
            this.userData.taskSublevel = 1
            if (this.awards.state.helpers === false) this.addAward('homemade')
            this.awards.state.helpers = false
          } else {
            this.$root.playAudio('endGame')
            this.modalOpen.endGame = true
            this.endGame = this.userData.history[this.userData.history.length - 1]
            this.loading = false
            if (this.awards.state.spend < 1000) this.addAward('scrooge')
            if (this.userData.common.bonus < 20) this.addAward('dweeb')
            if (this.userData.common.bonus === 40) this.addAward('smarty')
            if (this.settings.lang === 'ru' && this.$store.state.userData[this.user.id].uk.history[0] && this.$store.state.userData[this.user.id].uk.history.length > 1) this.addAward('polyglot')
            if (this.settings.lang === 'uk' && this.$store.state.userData[this.user.id].ru.history[0] && this.$store.state.userData[this.user.id].ru.history.length > 1) this.addAward('polyglot')
            let ref = firebase.database().ref('users')
            let lang = this.settings.lang
            ref.orderByChild(`${lang}/history/`).limitToLast(20).on('child_added', (data) => {
              if (data.key === this.user.id) this.addAward('champion')
            })
            return
          }
        }
        Object.assign(this.$data, this.$options.data())
        let firebaseData = {
          userId: this.user.id,
          lang: this.settings.lang,
          props: {
            taskLevel: this.userData.taskLevel,
            taskSublevel: this.userData.taskSublevel,
            coins: this.userData.coins,
            strike: this.userData.strike,
            common: this.userData.common,
            history: this.userData.history
          }
        }
        let firebaseDataAwards = {
          userId: this.user.id,
          state: this.awards.state
        }
        if (type === 'saveAndExit') {
          this.$root.playAudio('click')
          this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
          this.$store.dispatch('UPDATE_USER_AWARDS', firebaseDataAwards)
          this.saveAndExit = true
          this.$router.replace('/')
          return
        }
        this.getNextLevel()
        this.startCounterdown()
        this.time = +new Date()
        this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
        this.$store.dispatch('UPDATE_USER_AWARDS', firebaseDataAwards)
      }, 100)
    },
    startNewGame () {
      this.loading = true
      this.modalOpen.endGame = false
      let history = this.userData.history
      history.push(0)
      let userData = this.userConfig[this.lang]
      userData.history = history
      this.$store.dispatch('UPDATE_USER_DATA', {
        userId: this.user.id,
        lang: this.lang,
        props: userData
      })
      this.$store.commit('SET_TASK', '')
      this.$store.commit('SET_SHUFFLED_TASK', [])
      // this.$store.commit('SET_CURRENT_COUNTERDOWN', false)
      this.$store.commit('SET_GAME', null)
      this.$store.commit('SET_ANSWERS_ALL', null)
      this.$store.commit('SET_ANSWERS', null)
      this.$store.commit('SET_USER_DATA_LANG', {
        id: this.user.id,
        lang: this.lang,
        data: userData
      })
      Object.assign(this.$data, this.$options.data())
      this.getNextLevel()
      this.startCounterdown()
      this.time = +new Date()
    },
    skipLevel () {
      this.skipeddLevel = true
      this.$root.playAudio('skipLevel')
      this.endLevel()
      if (this.$store.state.game) {
        this.$store.commit('SET_GAME_PROPS', {
          skipeddLevel: true
        })
      } else {
        this.$store.commit('SET_GAME', this.$data)
        this.$store.commit('SET_ANSWERS', this.answers)
      }
      // this.answers.forEach((el, index) => {
      //   this.answers[index].helpers = el.answer.split('')
      // })
      this.solutions[0] = this.answers[0].answer
    },
    checkInput () {
      this.checkAnswer(this.input)
      this.input = ''
    },
    validateInput () {
      let reg = new RegExp(`[^${this.task}]`, 'g')
      let res = reg.exec(this.input)
      this.input = this.input.replace(res, '')
      this.awards.state.input = true
    },
    pressLetter () {
      let draw = Draw.pressDraw.bind(this)
      draw(event)
    },
    endPressDraw (event, cancel) {
      let draw = Draw.endPressDraw.bind(this)
      draw(event, cancel)
    },
    addAward (award) {
      if (this.awards.received.indexOf(award) !== -1) return
      this.$root.playAudio('award')
      this.awards.received.push(award)
      let firebaseDataAwards = {
        userId: this.user.id,
        received: this.awards.received
      }
      this.$store.dispatch('UPDATE_USER_AWARDS', firebaseDataAwards)
      let awardData = this.awardsList.find(x => x.name === award)
      this.modalAwards.push(awardData)
      console.log(this.modalOpen.awards)
      console.log(this.modalAwards)
      setTimeout(() => {
        if (!this.modalOpen.awards) this.modalOpen.awards = true
      }, 200)
    },
    addWord () {
      this.userData.common.addWords++
      if (this.userData.common.addWords >= 10) this.addAward('bibliophile')
    },
    openModal (modal) {
      this.$root.playAudio('click')
      this.modalOpen[modal] = true
      if (modal === 'treasure') {
        this.awards.state.treasure++
        if (this.awards.state.treasure === 50) this.addAward('storekeeper')
      }
      if (modal === 'solutions') {
        this.awards.state.solutions++
        if (this.awards.state.solutions === 50) this.addAward('pride')
      }
    },
    clearPanelInfo (panel, reset) {
      if (panel === 'all') {
        this.panelInfo = {}
        return
      }
      setTimeout(() => {
        this.panelInfo[panel].className = ''
        this.panelInfo[panel].text = ''
        this.panelInfo[panel].count = 0
      }, 1000)
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.page-game{
  display:flex;
  flex-direction:column;
  flex:auto;
  position:relative;
}
.game-body{
  display:flex;
  flex-direction:column;
  flex:auto;
  .container{
    display:flex;
    flex-direction:column;
    flex:auto;
    justify-content:center;
  }
}
.panel{
  left:0;
  right:0;
  z-index:666;
  position:fixed;
}
.panel-top{
  top:0;
  border-bottom:solid 0.0714rem #ccc;
  background: repeating-linear-gradient(60deg, #f1f1f1, #f1f1f1 2px,#f9f9f9 2px,#f9f9f9 6px);
  .panel-btn{
    height:2.8571rem;
    width:auto;
  }
}
.panel-bottom{
  bottom:0;
  border-top:solid 0.0714rem #ccc;
  background: repeating-linear-gradient(-60deg, #f1f1f1, #f1f1f1 2px,#f9f9f9 2px,#f9f9f9 6px);
}
.panel-body{
  display:flex;
  align-items:center;
}
.icon-block{
  display:flex;
  align-items:center;
  .icon{
    &:not(:last-child){
      margin-right:0.3571rem;
    }
  }
  use{
    fill:#000;
  }
}
.panel-block{
  height:2.8571rem;
  position:relative;
  &:not(:last-child){
    padding-right:0.7143rem;
  }
}
.panel-btn{
  height:3.5714rem;
  width:3.4286rem;
  border:0;
  background:none;
  position:relative;
  .icon{
    display:block;
    margin:auto;
    width:2.2857rem;
    height:2.2857rem;
  }
}
.panel-btn-mistakes{
  margin-right:auto;
}
.panel-btn-skip{
  white-space:nowrap;
  width:auto;
  font-weight:700;
  .icon{
    display:inline-block;
    vertical-align:middle;
  }
}
.panel-btn-skip-desc{
  margin-right:0.3571rem;
}
.panel-btn-count{
  height:1.4286rem;
  width:1.4286rem;
  text-align:center;
  display:flex;
  flex-direction:column;
  justify-content:center;
  position:absolute;
  border-radius:50%;
  font-size:0.7143rem;
  top:0.3571rem;
  left:0;
  font-weight:700;
  border:solid 0.0714rem;
  background-color:#fff;
}
.panel-btn-count-right{
  left:auto;
  right:0;
}
.panel-block-level{
  margin-right:auto;
}
.icon{
  width:1.4286rem;
  height:1.4286rem;
  flex:none;
}
.icon-desc{
  white-space:nowrap;
  font-size:0.8571rem;
  font-weight:700;
}
.level-done{
  position:absolute;
  z-index:66;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background-color:rgba(255,255,255,.95);
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
  padding:2.8571rem 0 3.5714rem;
  .container{
    display:flex;
    flex-direction:column;
    align-items:center;
  }
}
.level-done-title{
  font-weight:700;
  font-size:1.7143rem;
  text-transform:uppercase;
}
.level-done-answers{
  margin-bottom:2.1429rem;
}
.level-done-answers-columns{
  columns:2;
  li{
    break-inside:avoid;
  }
}
.level-done-btn{
  border:0;
  white-space:nowrap;
  background:none;
  .icon{
    width:2.1429rem;
    height:2.1429rem;
    vertical-align:middle;
  }
  span{
    margin-right:0.7143rem;
    font-weight:700;
    vertical-align:middle;
  }
}
.answers{
  display:flex;
  flex-wrap:wrap;
  margin:0.3571rem -0.3571rem -0.3571rem;
}
.answer{
  padding:0 0.3571rem 0.3571rem;
  min-width:50%;
}
.task{
  position:relative;
  margin:0 -1.0714rem;
  flex:none;
}
.task-cancel-wrapp{
  position:absolute;
  right:0;
  bottom:0;
  left:0;
  top:0;
  overflow:hidden;
}
.task-cancel{
  position:absolute;
  width:10.7143rem;
  height:10.7143rem;
  right:-5.3571rem;
  top:-5.3571rem;
  border-radius:50%;
  background-color:#ffb5b5;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  align-items:center;
  padding:1.4286rem;
  transform:rotate(45deg);
  color:#fff;
  border:0;
}
.task-info{
  padding:0.7143rem 0;
  display:flex;
  flex-direction:column;
  align-items:center;
  flex:none;
}
.press-enter-btn{
  padding:0.7143rem 1.4286rem;
  border:0;
  border-radius:~'43% 57% 43% 57% / 46% 39% 61% 54%';
  background-color:green;
  visibility:hidden;
  height:3rem;
  color:#fff;
  position:relative;
  z-index:2;
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
  width:14.2857rem;
  height:17.8571rem;
  display:flex;
  flex-wrap:wrap;
  justify-content:space-between;
  user-select:none;
  margin:auto;
  position:relative;
  z-index:2;
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
    width:3.4286rem;
    height:3.4286rem;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    border-radius:~'37% 63% 43% 57% / 56% 43% 57% 44%';
    cursor:pointer;
    border:solid 0.0714rem #ccc;
    background-color:#fff;
    position:relative;
    z-index:1;
    font-size:1.7143rem;
    font-weight:700;
    transition:.2s;
    font-family:@f;
    &:before{
      content:'';
      position:absolute;
      left:-0.7143rem;
      right:-0.7143rem;
      top:-0.7143rem;
      bottom:-0.7143rem;
      pointer-events:none;
      opacity:0;
      transition:.2s;
      border-radius:inherit;
      transform:rotate(90deg);
      border:dashed 0.1429rem #ccc;
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
      background-color:@title;
      color:#fff;
    }
  }
  &.wrong{
    span{
      background-color:@red;
      color:#fff;
    }
  }
  &.correct{
    span{
      background-color:@green;
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
  width:15.7143rem;
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
  width:17.8571rem;
  li{
    width:50%;
    &:nth-child(1){
      width:100%;
      align-items:center;
      justify-content:flex-end;
    }
    &:nth-child(2){
      padding-left:0.7143rem;
    }
    &:nth-child(3){
      align-items:flex-end;
      padding-right:0.7143rem;
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
      padding-left:2.5rem;
      justify-content:center;
    }
    &:nth-child(7){
      align-items:center;
      padding-right:2.5rem;
      justify-content:center;
    }
  }
}
.task-list-8{
  width:17.8571rem;
  li{
    width:50%;
    justify-content:center;
    &:nth-child(1){
      justify-content:flex-end;
      align-items:center;
      padding-left:3.5714rem;
    }
    &:nth-child(2){
      justify-content:flex-end;
      align-items:center;
      padding-right:3.5714rem;
    }
    &:nth-child(3){
      justify-content:flex-end;
      padding-bottom:0.7143rem;
    }
    &:nth-child(4){
      align-items:flex-end;
      justify-content:flex-end;
      padding-bottom:0.7143rem;
    }
    &:nth-child(5){
      padding-top:0.7143rem;
    }
    &:nth-child(6){
      align-items:flex-end;
      padding-top:0.7143rem;
    }
    &:nth-child(7){
      align-items:center;
      padding-left:3.5714rem;
      padding-bottom:0.7143rem;
      justify-content:center;
    }
    &:nth-child(8){
      align-items:center;
      padding-right:3.5714rem;
      padding-bottom:0.7143rem;
      justify-content:center;
    }
  }
}
.task-list-9{
  width:17.8571rem;
  span{
    width:3.1429rem;
    height:3.1429rem;
  }
  li{
    width:50%;
    justify-content:center;
    height:20%;
    justify-content:flex-end;
    &:nth-child(1){
      align-items:center;
      padding-left:3.5714rem;
    }
    &:nth-child(2){
      align-items:center;
      padding-right:3.5714rem;
    }
    &:nth-child(3){
      padding-left:1.0714rem;
      justify-content:center;
    }
    &:nth-child(4){
      align-items:flex-end;
      padding-right:1.0714rem;
      justify-content:center;
    }
    &:nth-child(6){
      align-items:flex-end;
    }
    &:nth-child(7){
      align-items:center;
    }
    &:nth-child(8){
      align-items:center;
    }
    &:nth-child(9){
      align-items:center;
      justify-content:flex-start;
      width:100%;
    }
  }
}
.task-list-10{
  width:17.8571rem;
  span{
    width:3.1429rem;
    height:3.1429rem;
  }
  li{
    width:50%;
    justify-content:center;
    height:20%;
    &:nth-child(1){
      justify-content:flex-end;
      align-items:center;
      padding-left:3.5714rem;
    }
    &:nth-child(2){
      justify-content:flex-end;
      align-items:center;
      padding-right:3.5714rem;
    }
    &:nth-child(3){
      justify-content:flex-start;
      padding-left:1.0714rem;
    }
    &:nth-child(4){
      align-items:flex-end;
      justify-content:flex-start;
      padding-right:1.0714rem;
    }
    &:nth-child(6){
      align-items:flex-end;
    }
    &:nth-child(7){
      justify-content:flex-end;
      padding-left:1.0714rem;
    }
    &:nth-child(8){
      align-items:flex-end;
      justify-content:flex-end;
      padding-right:1.0714rem;
    }
    &:nth-child(9){
      align-items:center;
      padding-left:3.5714rem;
    }
    &:nth-child(10){
      align-items:center;
      padding-right:3.5714rem;
    }
  }
}
.task-list-11{
  width:17.8571rem;
  span{
    width:2.8571rem;
    height:2.8571rem;
  }
  li{
    width:50%;
    justify-content:center;
    height:20%;
    &:nth-child(1){
      justify-content:flex-end;
      align-items:center;
      padding-left:3.5714rem;
    }
    &:nth-child(2){
      justify-content:flex-end;
      align-items:center;
      padding-right:3.5714rem;
    }
    &:nth-child(3){
      justify-content:flex-start;
      padding-left:1.0714rem;
    }
    &:nth-child(4){
      align-items:flex-end;
      justify-content:flex-start;
      padding-right:1.0714rem;
    }
    &:nth-child(6){
      align-items:flex-end;
    }
    &:nth-child(7){
      padding-left:0.3571rem;
    }
    &:nth-child(8){
      align-items:flex-end;
      padding-right:0.3571rem;
    }
    &:nth-child(9){
      align-items:center;
      padding-left:1.4286rem;
      width:33.333%;
      justify-content:flex-start;
    }
    &:nth-child(10){
      align-items:center;
      width:33.333%;
      justify-content:flex-end;
    }
    &:nth-child(11){
      align-items:center;
      width:33.333%;
      padding-right:1.4286rem;
      justify-content:flex-start;
    }
  }
}
.task-list-12{
  width:17.8571rem;
  span{
    width:2.8571rem;
    height:2.8571rem;
  }
  li{
    width:50%;
    justify-content:center;
    height:20%;
    &:nth-child(1){
      justify-content:flex-end;
      align-items:center;
      padding-left:1.7857rem;
      width:33.333%;
    }
    &:nth-child(2){
      justify-content:flex-start;
      align-items:center;
      width:33.333%;
    }
    &:nth-child(3){
      justify-content:flex-end;
      padding-right:1.7857rem;
      width:33.333%;
    }
    &:nth-child(4){
      padding-left:0.3571rem;
    }
    &:nth-child(5){
      align-items:flex-end;
      padding-right:0.3571rem;
    }
    &:nth-child(7){
      align-items:flex-end;
    }
    &:nth-child(8){
      padding-left:0.3571rem;
    }
    &:nth-child(9){
      padding-right:0.3571rem;
      align-items:flex-end;
    }
    &:nth-child(10){
      align-items:center;
      width:33.333%;
      padding-left:1.7857rem;
      justify-content:flex-start;
    }
    &:nth-child(11){
      align-items:center;
      width:33.333%;
      justify-content:flex-end;
    }
    &:nth-child(12){
      align-items:center;
      width:33.333%;
      padding-right:1.7857rem;
      justify-content:flex-start;
    }
  }
}
.task-list-13{
  width:17.8571rem;
  span{
    width:3.1429rem;
    height:3.1429rem;
  }
  li{
    width:33.333%;
    justify-content:center;
    height:20%;
    align-items:center;
    &:nth-child(4){
      align-items:flex-start;
      width:50%;
    }
    &:nth-child(5){
      align-items:flex-end;
      width:50%;
    }
    &:nth-child(6){
      align-items:flex-start;
    }
    &:nth-child(7){
      justify-content:flex-start;
    }
    &:nth-child(8){
      align-items:flex-end;
    }
    &:nth-child(9){
      align-items:flex-start;
    }
    &:nth-child(10){
      justify-content:flex-end;
    }
    &:nth-child(11){
      align-items:flex-end;
    }
  }
}
.task-list-14{
  width:17.8571rem;
  span{
    width:3.1429rem;
    height:3.1429rem;
  }
  li{
    width:33.333%;
    justify-content:center;
    height:20%;
    align-items:center;
    &:nth-child(4){
      align-items:flex-start;
      width:50%;
    }
    &:nth-child(5){
      align-items:flex-end;
      width:50%;
    }
    &:nth-child(6){
      align-items:flex-start;
    }
    &:nth-child(7){
      justify-content:flex-start;
    }
    &:nth-child(8){
      align-items:flex-end;
    }
    &:nth-child(9){
      align-items:flex-start;
    }
    &:nth-child(11){
      align-items:flex-end;
    }
    &:nth-child(13){
      justify-content:flex-end;
    }
  }
}
.task-list-15{
  width:17.8571rem;
  span{
    width:3.1429rem;
    height:3.1429rem;
  }
  li{
    width:50%;
    justify-content:center;
    height:20%;
    align-items:center;
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(12),
    &:nth-child(13),
    &:nth-child(14),
    &:nth-child(15){
      width:25%;
    }
    &:nth-child(5){
      align-items:flex-start;
    }
    &:nth-child(6){
      align-items:flex-end;
    }
    &:nth-child(7){
      align-items:flex-start;
      width:33.333%;
    }
    &:nth-child(8){
      width:33.333%;
    }
    &:nth-child(9){
      align-items:flex-end;
      width:33.333%;
    }
    &:nth-child(10){
      align-items:flex-start;
    }
    &:nth-child(11){
      align-items:flex-end;
    }
  }
}
.task-list-16{
  width:17.8571rem;
  span{
    width:3rem;
    height:3rem;
  }
  li{
    width:33.333%;
    justify-content:center;
    height:20%;
    align-items:center;
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(13),
    &:nth-child(14),
    &:nth-child(15),
    &:nth-child(16){
      width:25%;
    }
    &:nth-child(5){
      align-items:flex-start;
    }
    &:nth-child(6){
      justify-content:flex-end;
    }
    &:nth-child(7){
      align-items:flex-end;
    }
    &:nth-child(8){
      align-items:flex-start;
      width:50%;
    }
    &:nth-child(9){
      align-items:flex-end;
      width:50%;
    }
    &:nth-child(10){
      align-items:flex-start;
    }
    &:nth-child(11){
      justify-content:flex-start;
    }
    &:nth-child(12){
      align-items:flex-end;
    }
  }
}
.answer-inputs{
  display:flex;
  margin-left:0.0714rem;
  li{
    margin-left:-0.0714rem;
  }
  &.currect{
    pointer-events:none;
  }
  label{
    display:block;
  }
}
.answer-input{
  width:1.7857rem;
  height:2rem;
  text-align:center;
  background-color:#eee;
  border:solid 0.0714rem #ccc;
  font-family:@f;
}
.answer-8,
.answer-9,
.answer-10,
.answer-11{
  .answer-input{
    width:1.5rem;
    height:1.8rem;
  }
}
.level-done-list{
  li+li{
    margin-top:2.1429rem;
  }
}
.input-wrapp{
  padding-top:3.5714rem;
  input{
    display:block;
    width:100%;
    height:2.8571rem;
    padding:0 1.0714rem;
    font-size:1.2857rem;
    text-align:center;
    border:solid 0.0714rem #ccc;
  }
}
.panel-block-time{
  .icon-desc{
    min-width:1.0714rem;
  }
}
.panel-info{
  position:absolute;
  left:50%;
  top:100%;
  width:10rem;
  margin-left:-5rem;
  text-align:center;
  font-weight:700;
  transform:translateY(1.4286rem);
  opacity:0;
  visibility:hidden;
  color:#fff;
  z-index:666;
  pointer-events:none;
  &.active{
    animation:panel-info 1s both;
  }
  &.plus{
    color:@green;
  }
  &.minus{
    color:@red;
  }
}
.panel-info-bottom{
  top:auto;
  bottom:100%;
  &.active{
    animation:panel-info-bottom 1s both;
  }
}
@keyframes panel-info{
  0%,100%{
    opacity:0;
    visibility:hidden;
  }
  50%{
    opacity:1;
    visibility:visible;
  }
  0%{
    transform:scale(1) translateY(1.4286rem);
  }
  100%{
    transform:scale(2) translateY(0);
  }
}
@keyframes panel-info-bottom{
  0%,100%{
    opacity:0;
    visibility:hidden;
  }
  50%{
    opacity:1;
    visibility:visible;
  }
  0%{
    transform:scale(2) translateY(0);
  }
  100%{
    transform:scale(1) translateY(-1.4286rem);
  }
}
.answer-14{
  .answer-input{
    width:1.55rem;
  }
}
.answer-15{
  .answer-input{
    width:1.45rem;
  }
}
.answer-16{
  .answer-input{
    width:1.35rem;
  }
}
.level-done-body{
  max-width:100%;
  margin-top:auto;
}
</style>
