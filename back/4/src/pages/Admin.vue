<template>
  <div class="page-content">
    <div class="container">
      <template v-if="words">
        <ul class="users">
          <template v-for="(langs, userId) in words">
            <li
              v-if="!checkEmptyWords(words[userId]) "
              :key="userId">
              <h3>{{ userId }}</h3>
              <template v-for="(list, lang) in langs">
                <div
                  v-if="Object.keys(list).length"
                  :key="lang"
                  class="lang-table-wrapp">
                  <table class="lang-table">
                    <tr>
                      <td colspan="4">
                        <div class="lang">{{ lang }}</div>
                        <ul class="btns">
                          <li>
                            <button
                              :disabled="disabled"
                              class="btn btn-toggle"
                              @click="toggleSelectAll(userId, lang)">Toggle Select All</button>
                          </li>
                          <li>
                            <button
                              :disabled="disabled || !checkbox[userId][lang].length"
                              class="btn btn-add"
                              @click="addOrDelete('add', userId, lang, checkbox[userId][lang])">Add selected</button>
                          </li>
                          <li>
                            <button
                              :disabled="disabled || !checkbox[userId][lang].length"
                              class="btn btn-delete"
                              @click="addOrDelete('delete', userId, lang, checkbox[userId][lang])">Delete selected</button>
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr
                      v-for="(desc, word) in list"
                      :key="word">
                      <td>
                        <label>
                          <input
                            v-model="checkbox[userId][lang]"
                            :value="word"
                            type="checkbox"
                          >
                          <span>{{ word }}</span>
                        </label>
                      </td>
                      <td>
                        <textarea
                          v-model="words[userId][lang][word]"/>
                      </td>
                      <td>
                        <button
                          :disabled="disabled"
                          class="btn btn-add"
                          @click="addOrDelete('add', userId, lang, [word])">add</button>
                      </td>
                      <td>
                        <button
                          :disabled="disabled"
                          class="btn btn-delete"
                          @click="addOrDelete('delete', userId, lang, [word])">delete</button>
                      </td>
                    </tr>
                  </table>
                </div>
              </template>
            </li>
          </template>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import Func from '../js/functions.js'

// import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseApp from '../js/firebase.js'

export default {
  components: {},
  data () {
    return {
      words: null,
      checkbox: {},
      disabled: false
    }
  },
  beforeCreate: function () {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user.uid !== 'jeE2xoaMUzUf8uT3IcN0q157yPB3') {
        // console.log(1)
        this.$router.push('/')
        return
      }
      let url = 'https://words-mincer.top/'
      if (location.port === '8080') {
        url = '/src/'
      }
      Func.getData(url + 'data/words_new.json', 'json').then(result => {
        this.checkbox = {}
        Object.keys(result).forEach(userId => {
          if (!this.checkbox[userId]) {
            this.$set(this.checkbox, userId, {})
          }
          Object.keys(result[userId]).forEach(lang => {
            if (!this.checkbox[userId][lang]) {
              this.$set(this.checkbox[userId], lang, [])
            }
            Object.keys(result[userId][lang]).forEach(word => {
              this.checkbox[userId][lang].push(word)
            })
          })
        })
        this.words = result
        // console.log(this.words)
        // let data = {
        //   json: JSON.stringify(this.words),
        //   fileName: 'words_new.json'
        // }
        // Func.putData('saveFile', data).then(result => {
        //   console.log(result)
        // })
      })
    })
  },
  methods: {
    checkEmptyWords (obj) {
      let isEmpty = true
      Object.keys(obj).forEach(el => {
        if (Object.keys(obj[el]).length) isEmpty = false
      })
      return isEmpty
    },
    toggleSelectAll (userId, lang) {
      if (this.checkbox[userId][lang].length) {
        this.checkbox[userId][lang] = []
      } else {
        Object.keys(this.words[userId][lang]).forEach(word => {
          this.checkbox[userId][lang].push(word)
        })
      }
    },
    addOrDelete (type, userId, lang, words) {
      this.disabled = true
      let data = {
        userId: userId,
        lang: lang,
        words: words
      }
      Func.putData('deleteWords', data).then(result => {
        if (type === 'add') {
          data.desc = []
          words.forEach(word => {
            data.desc.push(this.words[userId][lang][word])
          })
          Func.putData('addWordsMaster', data).then(result => {
            this.disabled = false
          })
        } else {
          this.disabled = false
        }
        words.forEach(word => {
          delete this.words[userId][lang][word]
        })
      })
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.users{
  &>li+li{
    padding-top:2rem;
    margin-top:2rem;
    border-top:solid 1px @border;
  }
}
.lang-table-wrapp{
  padding:1rem;
  margin-top:1rem;
  background-color:@gray;
  border:solid 1px @border;
}
.lang-table{
  td{
    padding:.5rem;
  }
}
.lang{
  font-weight:700;
  margin-bottom:.75rem;
}
.btns{
  display:flex;
  align-items:center;
  margin:0 -.5rem;
  li{
    padding:0 .5rem;
  }
}
label{
  user-select:none;
  cursor:pointer;
  display:flex;
  align-items:center;
  input{
    margin-right:.5rem;
  }
}
.btn{
  padding:.125rem .5rem;
  display:block;
  color:#fff;
  border:0;
  &[disabled]{
    opacity:.4;
    pointer-events:none;
  }
}
.btn-delete{
  background-color:@red;
}
.btn-add{
  background-color:@green;
}
.btn-toggle{
  background-color:@placeholder;
}
[type="checkbox"]{
  cursor:pointer;
  display:block;
}
</style>
