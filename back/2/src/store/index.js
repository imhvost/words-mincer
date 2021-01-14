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
      audio: 'on'
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
    isOffline: false,
    text: text,
    answersAll: null,
    answers: null,
    game: null,
    nextLevel: {
      task: null,
      answersAll: null
    }
  }
}

export const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    RESET_STATE (state, payload) {
      localStorage.clear()
      Object.assign(state, getDefaultState())
      state.game = null
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
        state.nextLevel[el] = payload[el]
      })
    },
    SET_TASK: (state, payload) => {
      state.task = payload
    },
    SET_SHUFFLED_TASK: (state, payload) => {
      state.shuffledTask = payload
    },
    SET_ANSWERS_ALL: (state, payload) => {
      state.answersAll = payload
    },
    SET_ANSWERS: (state, payload) => {
      state.answers = payload
    },
    // SET_CURRENT_COUNTERDOWN: (state, payload) => {
    //   state.currentCounterdown = payload
    // },
    SET_SETTINGS: (state, payload) => {
      state.settings = payload
    },
    SET_IS_OFFLINE: (state, payload) => {
      state.isOffline = payload
    }
  },
  actions: {
    // UPDATE_USER_DATA: (context, data) => {
    //   firebase.database().ref(`users/${data.userId}/${data.lang}`).set(data.userData, () => {
    //     console.log('update firebase')
    //   })
    // },
    UPDATE_USER_PROFILE: (context, data) => {
      if (!navigator.onLine) {
        context.commit('SET_IS_OFFLINE', true)
        return
      }
      Object.keys(data.props).forEach(el => {
        firebase.database().ref(`users/${data.userId}/profile/${el}`).set(data.props[el], () => {
          // console.log('update firebase')
        })
      })
    },
    UPDATE_USER_DATA: (context, data) => {
      if (!navigator.onLine) {
        context.commit('SET_IS_OFFLINE', true)
        return
      }
      Object.keys(data.props).forEach(el => {
        firebase.database().ref(`users/${data.userId}/${data.lang}/${el}`).set(data.props[el], () => {
          // console.log('update firebase')
        })
      })
    },
    UPDATE_USER_AWARDS: (context, data) => {
      if (!navigator.onLine) {
        context.commit('SET_IS_OFFLINE', true)
        return
      }
      if (data.received) {
        context.commit('SET_USER_DATA_AWARDS', {
          id: data.userId,
          prop: 'received',
          data: data.received
        })
        firebase.database().ref(`users/${data.userId}/awards/received`).set(data.received, () => {
          // console.log('update firebase')
        })
      }
      if (data.state) {
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
