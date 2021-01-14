<template>
  <div class="page-content">
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
</template>

<script>
import Func from '../js/functions.js'

export default {
  components: {},
  data () {
    return {
      loadingWords: false
    }
  },
  computed: {
    settings () {
      return this.$store.state.settings
    }
  },
  methods: {
    changeSettings (event, key) {
      let value = event.target.value
      this.settings[key] = value
      this.$store.commit('SET_SETTINGS', this.settings)
      if (key === 'lang') {
        this.loadingWords = true
        let wordsFile = `/data/words_${value}.json`
        let data = Func.getData(wordsFile, 'json')
        data.then(result => {
          this.$store.commit('SET_WORDS', result)
          this.$store.commit('SET_TASK', '')
          this.$store.commit('SET_SHUFFLED_TASK', [])
          this.loadingWords = false
        })
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
</style>
