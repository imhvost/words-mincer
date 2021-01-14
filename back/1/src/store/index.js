import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import firebase from 'firebase'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    settings: {
      lang: 'ru',
      input: 'draw',
      audio: 'off'
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
    currentCounterdown: false
  }
}

// localStorage.clear()

export const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    RESET_STATE (state) {
      Object.assign(state, getDefaultState())
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
    SET_IS_LOAD_DATA: (state, payload) => {
      state.isLoadData = payload
    },
    SET_LOADING_USER: (state, payload) => {
      state.loadingUser = payload
    },
    SET_TASK: (state, payload) => {
      state.task = payload
    },
    SET_SHUFFLED_TASK: (state, payload) => {
      state.shuffledTask = payload
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
      Object.keys(data.props).forEach(el => {
        firebase.database().ref(`users/${data.userId}/profile/${el}`).set(data.props[el], () => {
          console.log('update firebase')
        })
      })
    },
    UPDATE_USER_DATA: (context, data) => {
      Object.keys(data.props).forEach(el => {
        firebase.database().ref(`users/${data.userId}/${data.lang}/${el}`).set(data.props[el], () => {
          console.log('update firebase')
        })
      })
    }
  },
  plugins: [createPersistedState()]
})
