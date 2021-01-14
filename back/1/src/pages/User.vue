<template>
  <div class="page-content">
    <div v-if="settings">
      <template v-if="!loadingWords">
        <p>Словарь</p>
        <select
          :value="settings.lang"
          @change="changeSettings($event, 'lang')">
          <option
            :selected="settings.lang === 'ru' ? true : false"
            value="ru">ru</option>
          <option
            :selected="settings.lang === 'uk' ? true : false"
            value="uk">uk</option>
        </select>
      </template>
      <div v-else>Загрузка словаря...</div>
      <p>Способ ввода</p>
      <select
        :value="settings.input"
        @change="changeSettings($event, 'input')">
        <option
          :selected="settings.input === 'draw' ? true : false"
          value="draw">draw</option>
        <option
          :selected="settings.input === 'press' ? true : false"
          value="press">press</option>
        <option
          :selected="settings.input === 'input' ? true : false"
          value="input">input</option>
      </select>
      <p>Звуки</p>
      <select
        :value="settings.audio"
        @change="changeSettings($event, 'audio')">
        <option
          :selected="settings.audio === 'on' ? true : false"
          value="on">on</option>
        <option
          :selected="settings.audio === 'off' ? true : false"
          value="off">off</option>
      </select>
    </div>
    <table
      v-if="userData"
      class="user-info">
      <tr v-if="user.img">
        <td>Аватар</td>
        <td><img :src="user.img"></td>
      </tr>
      <tr v-if="user.name">
        <td>Имя</td>
        <td>{{ user.name }}</td>
      </tr>
      <tr>
        <td>Словарь</td>
        <td>{{ $route.params.lang }}</td>
      </tr>
      <template v-if="!loadingWords">
        <tr>
          <td>Текущий уровень</td>
          <td>{{ userData.taskLevel }} / {{ userData.taskSublevel }}</td>
        </tr>
        <tr>
          <td>Монеты</td>
          <td>{{ userData.coins }}</td>
        </tr>
        <tr>
          <td>Время в игре:</td>
          <td>{{ userData.common.time }} </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import Func from '../js/functions.js'
import firebase from 'firebase'
import firebaseApp from '../js/firebase.js'

export default {
  components: {},
  data () {
    return {
      loadingWords: false,
      userData: null,
      settings: null,
      user: null
    }
  },
  computed: {
  //
  },
  mounted: function () {
    firebaseApp.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (user.uid === this.$route.params.id) {
          this.settings = this.$store.state.settings
          this.user = this.$store.state.user
          this.userData = this.$store.state.userData[this.user.id][this.settings.lang]
        } else {
          firebase.database().ref(`users/${this.$route.params.id}/${this.$route.params.lang}`).on('value', (data) => {
            this.userData = data.val()
          })
          firebase.database().ref(`users/${this.$route.params.id}/profile`).on('value', (data) => {
            this.user = data.val()
          })
        }
      } else {
        firebase.database().ref(`users/${this.$route.params.id}/${this.$route.params.lang}`).on('value', (data) => {
          this.userData = data.val()
        })
      }
    }.bind(this))
  },
  methods: {
    changeSettings (event, key) {
      let value = event.target.value
      this.settings[key] = value
      this.$store.commit('SET_SETTINGS', this.settings)
      if (key === 'lang') {
        this.$router.replace({
          params: {
            'lang': value
          }
        })
        this.loadingWords = true
        let wordsFile = `/data/words_${value}.json`
        let data = Func.getData(wordsFile, 'json')
        data.then(result => {
          this.$store.commit('SET_WORDS', result)
          this.$store.commit('SET_TASK', '')
          this.$store.commit('SET_SHUFFLED_TASK', [])
          this.loadingWords = false
          this.userData = this.$store.state.userData[this.user.id][value]
        })
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
</style>
