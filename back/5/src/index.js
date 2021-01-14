import './less/styles.less'
import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import createRouter from './router'
import { store } from './store'
import Vuefire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseApp from './js/firebase.js'
import Func from './js/functions.js'
import userConfig from './data/user.json'
import {mapState} from 'vuex'
import Worker from './js/next-level.worker.js'

Vue.use(Router)
Vue.use(Vuefire)

const router = new Router(createRouter)

// Func.buildLevels()

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  data: {
    audio: {
      click: new Audio('/static/audio/click.mp3'),
      draw: new Audio('/static/audio/draw.mp3'),
      bomb: new Audio('/static/audio/bomb.mp3'),
      buy: new Audio('/static/audio/buy.mp3'),
      correct: new Audio('/static/audio/correct.mp3'),
      endLevel: new Audio('/static/audio/endLevel.mp3'),
      endLevelHaveTime: new Audio('/static/audio/endLevelHaveTime.mp3'),
      endTime: new Audio('/static/audio/endTime.mp3'),
      error: new Audio('/static/audio/error.mp3'),
      levelUp: new Audio('/static/audio/levelUp.mp3'),
      openFirstLetters: new Audio('/static/audio/openFirstLetters.mp3'),
      openLastLetters: new Audio('/static/audio/openLastLetters.mp3'),
      skipLevel: new Audio('/static/audio/skipLevel.mp3'),
      strike: new Audio('/static/audio/strike.mp3'),
      treasure: new Audio('/static/audio/treasure.mp3'),
      award: new Audio('/static/audio/award.mp3'),
      openNothing: new Audio('/static/audio/openNothing.mp3'),
      endGame: new Audio('/static/audio/endGame.mp3')
    },
    onLine: navigator.onLine,
    siteUrl: 'https://words-mincer.top/',
    isInstall: true,
    userData: null
  },
  computed: {
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.index
    },
    ...mapState(['words', 'levels'])
  },
  watch: {
    onLine (v) {
      if (v) {
        let user = this.$store.state.user
        let settings = this.$store.state.settings
        let userData = this.$store.state.userData
        if (user && settings && userData) {
          let data = userData[user.id][settings.lang]
          if (data) {
            let firebaseData = {
              userId: user.id,
              lang: settings.lang,
              props: {
                taskLevel: data.taskLevel,
                taskSublevel: data.taskSublevel,
                coins: data.coins,
                strike: data.strike,
                common: data.common
              }
            }
            this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
          }
          let awards = userData[user.id].awards
          if (awards) {
            let firebaseDataAwards = {
              userId: user.id,
              state: awards.state
            }
            this.$store.dispatch('UPDATE_USER_AWARDS', firebaseDataAwards)
          }
        } else {
          alert(this.text.offlineNotSave[this.lang])
        }
      }
    }
  },
  mounted: function () {
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
    let wordsFile = `/data/words_${this.lang}.json`
    let config = this.$store.state.config
    let words = this.$store.state.words
    let levels = this.$store.state.levels
    if (config && words && levels) {
      if (this.onLine) {
        let wordsVersion = config.wordsVersion[this.lang]
        Func.getData('/data/config.json', 'json', true).then(result => {
          // console.log(wordsVersion, result.wordsVersion[this.lang])
          if (wordsVersion !== result.wordsVersion[this.lang]) {
            this.$store.commit('SET_CONFIG', result)
            Func.getData(wordsFile, 'json', true).then(result => {
              this.$store.commit('SET_WORDS', result)
            }).catch(() => {
              this.$store.commit('SET_IS_LOAD_DATA', true)
            })
            return
          }
          this.$store.commit('SET_IS_LOAD_DATA', true)
        }).catch(() => {
          this.$store.commit('SET_IS_LOAD_DATA', true)
        })
      }
    } else {
      if (!this.onLine) {
        alert(this.text.onlineNeed[this.lang])
        return
      }
      let data = Promise.all(
        [
          Func.getData('/data/config.json', 'json', true),
          Func.getData(wordsFile, 'json'),
          Func.getData('/data/levels.json', 'json', true)
        ]
      )
      data.then(result => {
        this.$store.commit('SET_CONFIG', result[0])
        this.$store.commit('SET_WORDS', result[1])
        this.$store.commit('SET_LEVELS', result[2])
        this.$store.commit('SET_IS_LOAD_DATA', true)
      })
    }
    if (!this.onLine) {
      if (this.$store.state.levels) {
        alert(this.text.offlineInfo[this.lang])
      } else {
        alert(this.text.onlineNeed[this.lang])
      }
      return
    }
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (this.$store.state.user === null && this.$store.state.userData === null) {
        this.$store.commit('RESET_USER_STATE')
      }
      if (user) {
        let userInfo = {
          name: user.displayName,
          img: user.photoURL,
          id: user.uid
        }
        this.$store.commit('SET_USER', userInfo)
        if (this.$store.state.userData) {
          let cacheUserData = this.$store.state.userData[user.uid]
          if (cacheUserData) {
            this.$store.commit('SET_LOADING_USER', false)
            if (user.metadata.lastSignInTime) {
              let firebaseData = {
                userId: user.uid,
                props: {
                  lastSignInTime: user.metadata.lastSignInTime
                }
              }
              this.$store.dispatch('UPDATE_USER_PROFILE', firebaseData)
            }
            return
          }
        }
        this.$bindAsObject('userData', firebaseApp.database().ref(`users/${user.uid}`), null, () => {
          // console.log(this.userData, this.userData['.value'])
          if (this.userData && this.userData['.value'] !== null) {
            let userData = {}
            userData[user.uid] = this.userData
            delete userData[user.uid]['.key']
            this.$store.commit('SET_USER_DATA', userData)
            this.userData = userData[user.uid][this.lang]
            this.getLevel()
          } else {
            firebase.database().ref(`users/${user.uid}`).set(userConfig, () => {
              let userData = {}
              userData[user.uid] = userConfig
              this.$store.commit('SET_USER_DATA', userData)
              this.userData = userData[user.uid][this.lang]
              this.getLevel()
            })
            let profile = {}
            if (user.displayName) {
              profile.name = user.displayName
            }
            if (user.photoURL) {
              profile.img = user.photoURL
            }
            if (user.metadata.creationTime) {
              profile.creationTime = user.metadata.creationTime
            }
            if (user.metadata.lastSignInTime) {
              profile.lastSignInTime = user.metadata.lastSignInTime
            }
            firebase.database().ref(`users/${user.uid}`).child('profile').set(profile, () => {
              // console.log('profile update')
            })
          }
        })
      }
      this.$store.commit('SET_LOADING_USER', false)
    })
  },
  methods: {
    getLevel () {
      if (!this.userData) return
      if (this.$store.state.task || this.$store.state.answersAll) return
      let level = this.userData.taskLevel
      let sublevel = this.userData.taskSublevel
      let wordLength = this.levels[level][sublevel].wordLength
      let sublevels = this.levels[level][sublevel].answers
      let minAnswerLength
      Object.keys(sublevels).forEach(el => {
        if (minAnswerLength) return
        if (sublevels[el] !== 0) minAnswerLength = +el
      })
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
        this.$store.commit('SET_TASK', e.data.task)
        this.$store.commit('SET_ANSWERS_ALL', e.data.answersAll)
      }
    },
    playAudio (src) {
      if (this.$store.state.settings.audio !== 'on') return
      // this.audio = new Audio(src)
      if (this.audio[src]) this.audio[src].play()
    },
    vibrate (time) {
      if (this.$store.state.settings.vibrate !== 'on') return
      window.navigator.vibrate(time)
    },
    updateOnlineStatus (e) {
      const {
        type
      } = e
      this.onLine = type === 'online'
    }
  },
  render: h => h(App),
  router: router,
  store: store
})
