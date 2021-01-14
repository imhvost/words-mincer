import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import firebase from 'firebase/app'
import 'firebase/database'
import awardsList from '../data/awards.json'
import text from '../data/text.json'

Vue.use(Vuex)

// const getDefaultGame = () => {
//   return {
//     treasure: [],
//     solutions: [],
//     mistakes: [],
//     answersCount: 0,
//     input: '',
//     answerLetters: [],
//     d: '',
//     isDraw: false,
//     counterdown: {
//       time: 0,
//       coins: 0,
//       timer: null
//     },
//     time: 0,
//     isDone: false,
//     endGame: false,
//     modalOpen: {
//       treasure: false,
//       solutions: false,
//       mistakes: false,
//       shop: false,
//       awards: false
//     },
//     loading: false,
//     sidebareClass: '',
//     taskListClass: '',
//     skipeddLevel: false,
//     saveAndExit: false,
//     modalAwards: []
//   }
// }

awardsList.map(el => {
  el.desc.ru = btoa(encodeURIComponent(el.desc.ru))
  el.desc.uk = btoa(encodeURIComponent(el.desc.uk))
  return el
})

const getDefaultState = () => {
  return {
    settings: {
      lang: navigator.language === 'uk' ? 'uk' : 'ru',
      input: 'draw',
      audio: 'on',
      vibrate: 'on'
    },
    config: null,
    words: null,
    levels: null,
    user: null,
    userData: null,
    isLoadData: false,
    loadingUser: true,
    task: '',
    shuffledTask: [],
    currentCounterdown: false,
    awardsList: awardsList,
    text: text,
    answersAll: null,
    answers: [],
    helpers: [],
    game: null,
    nextLevel: {
      task: null,
      answersAll: null
    }
  }
}

// localStorage.clear()

export const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    RESET_STATE (state, payload) {
      localStorage.clear()
      Object.assign(state, getDefaultState())
      state.game = null
    },
    RESET_USER_STATE (state, payload) {
      state.user = null
      state.userData = null
      state.task = ''
      state.shuffledTask = []
      state.answersAll = null
      state.answers = []
      state.helpers = []
      state.game = null
      state.nextLevel = {
        task: null,
        answersAll: null
      }
    },
    // EXIT_GAME (state, payload) {
    //   state.isExitGame = true
    //   state.userData = null
    //   state.loadingUser = true
    //   state.task = ''
    //   state.shuffledTask = []
    //   state.currentCounterdown = payload.currentCounterdown ? payload.currentCounterdown : false
    // },
    SET_GAME: (state, payload) => {
      state.game = payload
    },
    SET_GAME_PROPS: (state, payload) => {
      Object.keys(payload).forEach(el => {
        state.game[el] = payload[el]
      })
    },
    SET_USER: (state, payload) => {
      state.user = payload
    },
    SET_WORDS: (state, payload) => {
      state.words = payload
    },
    SET_LEVELS: (state, payload) => {
      state.levels = payload
    },
    SET_CONFIG: (state, payload) => {
      state.config = payload
    },
    SET_USER_DATA: (state, payload) => {
      state.userData = payload
    },
    SET_USER_DATA_LANG: (state, payload) => {
      state.userData[payload.id][payload.lang] = payload.data
    },
    SET_USER_DATA_AWARDS: (state, payload) => {
      state.userData[payload.id].awards[payload.prop] = payload.data
    },
    SET_IS_LOAD_DATA: (state, payload) => {
      state.isLoadData = payload
    },
    SET_LOADING_USER: (state, payload) => {
      state.loadingUser = payload
    },
    NEXT_LEVEL: (state, payload) => {
      Object.keys(payload).forEach(el => {
        if (payload[el]) {
          if (typeof payload[el] === 'string') {
            state.nextLevel[el] = btoa(encodeURIComponent(payload[el]))
          } else {
            let answers = {}
            Object.keys(payload[el]).forEach(key => {
              let encodedAnswers = payload[el][key].map(el => btoa(encodeURIComponent(el)))
              answers[key] = encodedAnswers
            })
            state.nextLevel[el] = answers
          }
        }
      })
    },
    SET_TASK: (state, payload) => {
      state.task = btoa(encodeURIComponent(payload))
    },
    SET_TASK_ENCODE: (state, payload) => {
      state.task = payload
    },
    SET_SHUFFLED_TASK: (state, payload) => {
      state.shuffledTask = payload
    },
    SET_ANSWERS_ALL: (state, payload) => {
      if (payload) {
        let answers = {}
        Object.keys(payload).forEach(key => {
          let encodedAnswers = payload[key].map(el => btoa(encodeURIComponent(el)))
          answers[key] = encodedAnswers
        })
        state.answersAll = answers
        return
      }
      state.answersAll = payload
    },
    SET_ANSWERS_ALL_ENCODE: (state, payload) => {
      state.answersAll = payload
    },
    SET_ANSWERS: (state, payload) => {
      state.answers = []
      state.helpers = []
      if (payload) {
        payload.forEach(el => {
          state.answers.push(btoa(encodeURIComponent(el.answer)))
          state.helpers.push(el.helpers)
        })
      }
    },
    SET_CURRENT_COUNTERDOWN: (state, payload) => {
      state.currentCounterdown = payload
    },
    SET_SETTINGS: (state, payload) => {
      state.settings = payload
    }
  },
  actions: {
    // UPDATE_USER_DATA: (context, data) => {
    //   firebase.database().ref(`users/${data.userId}/${data.lang}`).set(data.userData, () => {
    //     console.log('update firebase')
    //   })
    // },
    UPDATE_USER_PROFILE: (context, data) => {
      if (!navigator.onLine) return
      if (data.userId === 'guest') return
      Object.keys(data.props).forEach(el => {
        firebase.database().ref(`users/${data.userId}/profile/${el}`).set(data.props[el], () => {
          // console.log('update firebase')
        })
      })
    },
    UPDATE_USER_DATA: (context, data) => {
      if (!navigator.onLine) return
      if (data.userId === 'guest') return
      Object.keys(data.props).forEach(el => {
        firebase.database().ref(`users/${data.userId}/${data.lang}/${el}`).set(data.props[el], () => {
          // console.log('UPDATE_USER_DATA')
        })
      })
    },
    UPDATE_USER_AWARDS: (context, data) => {
      if (data.received) {
        context.commit('SET_USER_DATA_AWARDS', {
          id: data.userId,
          prop: 'received',
          data: data.received
        })
        if (!navigator.onLine) return
        if (data.userId === 'guest') return
        firebase.database().ref(`users/${data.userId}/awards/received`).set(data.received, () => {
          // console.log('update firebase')
        })
      }
      if (data.state) {
        if (!navigator.onLine) return
        if (data.userId === 'guest') return
        if (data.state.props) {
          Object.keys(data.state.props).forEach(el => {
            firebase.database().ref(`users/${data.userId}/awards/state/${el}`).set(data.state.props[el], () => {
              // console.log('update firebase')
            })
          })
        } else {
          firebase.database().ref(`users/${data.userId}/awards/state`).set(data.state, () => {
            // console.log('update firebase')
          })
        }
      }
    }
  },
  plugins: [createPersistedState()]
})
