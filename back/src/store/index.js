import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    config: null,
    wordsRu: null,
    levels: null,
    user: null,
    userData: null
  },
  mutations: {
    SET_USER: (state, payload) => {
      state.user = payload
    },
    SET_WORDS_RU: (state, payload) => {
      state.wordsRu = payload
    },
    SET_LEVELS: (state, payload) => {
      state.levels = payload
    },
    SET_CONFIG: (state, payload) => {
      state.config = payload
    },
    SET_USER_DATA: (state, payload) => {
      state.userData = payload
    }
  },
  actions: {
    SET_USER: (context, data) => {
      context.commit('SET_USER', data)
    },
    SET_WORDS_RU: (context, data) => {
      context.commit('SET_WORDS_RU', data)
    },
    SET_LEVELS: (context, data) => {
      context.commit('SET_LEVELS', data)
    },
    SET_CONFIG: (context, data) => {
      context.commit('SET_CONFIG', data)
    },
    SET_USER_DATA: (context, data) => {
      context.commit('SET_USER_DATA', data)
    }
  }
})
