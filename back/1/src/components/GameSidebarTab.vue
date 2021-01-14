<template>
  <div class="game-sidebar-tab">
    <h3 class="game-sidebar-tab-title">{{ title }}</h3>
    <ul
      v-if="words.length"
      class="game-sidebar-tab-list">
      <li
        v-for="(word, key) in words"
        :key="key">
        <div v-if="add.indexOf(word) === -1">
          <b>{{ word }}</b>
          <textarea
            v-if="mistakes"
            v-model="desc[key]"
            placeholder="Описание"/>
          <button
            v-if="mistakes"
            @click="addWord(word, key)">Add</button>
        </div>
        <div v-else><b>{{ word }}</b> Добавлено! Скоро проверим!</div>
        <div
          v-if="!mistakes"
          v-html="descriptions[word]"/>
      </li>
    </ul>
    <div v-else>...</div>
  </div>
</template>

<script>
import Func from '../js/functions.js'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    words: {
      type: Array,
      required: true
    },
    descriptions: {
      type: Object,
      required: false,
      default: null
    },
    mistakes: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      desc: [],
      add: []
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    addWord (word, key) {
      let desc = this.desc[key] || ''
      let data = {
        word: word,
        desc: desc,
        userId: this.user.id
      }
      Func.putData('addWord', data).then(result => {
        // console.log(result)
        this.add.push(word)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';

</style>
