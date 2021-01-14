import './less/styles.less'
import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import createRouter from './router'
import { store } from './store'
import Vuefire from 'vuefire'
import firebase from 'firebase'
import firebaseApp from './js/firebase.js'
import Func from './js/functions.js'
import userConfig from './data/user.json'

Vue.use(Router)
Vue.use(Vuefire)

const router = new Router(createRouter)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  data: {
    loadingData: true,
    config: null,
    wordsRu: null,
    levels: null,
    user: null,
    userData: null,
    loadingUser: true
  },
  mounted: function () {
    localStorage.clear()
    let config = localStorage.getItem('config')
    let wordsRu = localStorage.getItem('wordsRu')
    let levels = localStorage.getItem('levels')
    if (config && wordsRu && levels) {
      this.config = JSON.parse(config)
      this.wordsRu = JSON.parse(wordsRu)
      this.levels = JSON.parse(levels)
      this.loadingData = false
    } else {
      let data = Promise.all(
        [
          Func.getData('/data/config.json', 'text'),
          Func.getData('/data/words_ru.json', 'text'),
          Func.getData('/data/levels.json', 'text')
        ]
      )
      data.then(result => {
        localStorage.setItem('config', result[0])
        localStorage.setItem('wordsRu', result[1])
        localStorage.setItem('levels', result[2])
        this.config = JSON.parse(result[0])
        this.wordsRu = JSON.parse(result[1])
        this.levels = JSON.parse(result[2])
        this.loadingData = false
      })
    }
    firebaseApp.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.user = user
        let cacheUserData = localStorage.getItem(user.uid)
        if (cacheUserData) {
          this.userData = JSON.parse(cacheUserData)
          this.loadingUser = false
          return
        }
        this.$bindAsObject('userData', firebaseApp.database().ref(`users/${user.uid}`), null, () => {
          if (this.userData && this.userData['.value'] !== null) {
            localStorage.setItem(user.uid, JSON.stringify(this.userData))
            this.loadingUser = false
          } else {
            firebase.database().ref(`users/${user.uid}`).set(userConfig, () => {
              this.userData = userConfig
              localStorage.setItem(user.uid, JSON.stringify(this.userData))
              this.loadingUser = false
            })
          }
        })
      } else {
        // firebase.auth.signInAnonymously().catch(console.error)
      }
    }.bind(this))
  },
  render: h => h(App),
  router: router,
  store: store
})
