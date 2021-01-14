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

// Func.buildLevels()

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  data: {},
  mounted: function () {
    let lang = this.$store.state.settings.lang
    let wordsFile = `/data/words_${lang}.json`
    let config = this.$store.state.config
    let words = this.$store.state.words
    let levels = this.$store.state.levels
    if (config && words && levels) {
      this.$store.commit('SET_IS_LOAD_DATA', true)
    } else {
      let data = Promise.all(
        [
          Func.getData('/data/config.json', 'json'),
          Func.getData(wordsFile, 'json'),
          Func.getData('/data/levels.json', 'json')
        ]
      )
      data.then(result => {
        this.$store.commit('SET_CONFIG', result[0])
        this.$store.commit('SET_WORDS', result[1])
        this.$store.commit('SET_LEVELS', result[2])
        this.$store.commit('SET_IS_LOAD_DATA', true)
      })
    }
    firebaseApp.auth().onAuthStateChanged(function (user) {
      if (user) {
        let userInfo = {
          name: user.displayName,
          img: user.photoURL,
          id: user.uid
        }
        if (user.metadata.lastSignInTime) {
          let firebaseData = {
            userId: user.uid,
            props: {
              lastSignInTime: user.metadata.lastSignInTime
            }
          }
          this.$store.dispatch('UPDATE_USER_PROFILE', firebaseData)
        }
        this.$store.commit('SET_USER', userInfo)
        if (this.$store.state.userData) {
          let cacheUserData = this.$store.state.userData[user.uid]
          if (cacheUserData) {
            this.$store.commit('SET_LOADING_USER', false)
            return
          }
        }
        this.$bindAsObject('userData', firebaseApp.database().ref(`users/${user.uid}`), null, () => {
          if (this.userData && this.userData['.value'] !== null) {
            let userData = {}
            userData[user.uid] = this.userData
            delete userData[user.uid]['.key']
            this.$store.commit('SET_USER_DATA', userData)
          } else {
            firebase.database().ref(`users/${user.uid}`).set(userConfig, () => {
              let userData = {}
              userData[user.uid] = userConfig
              this.$store.commit('SET_USER_DATA', userData)
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
              console.log('profile update')
            })
          }
        })
      }
      this.$store.commit('SET_LOADING_USER', false)
    }.bind(this))
  },
  render: h => h(App),
  router: router,
  store: store
})
