<template>
  <div class="page-content">
    <div class="container">
      <template v-if="words">
        <ul class="btns">
          <li>
            <button
              class="btn btn-add"
              @click="addOrDeleteAll('add')">ADD ALL SELECTED</button>
          </li>
          <li>
            <button
              class="btn btn-delete"
              @click="addOrDeleteAll('delete')">DELETE ALL SELECTED</button>
          </li>
        </ul>
        <ul class="users">
          <template v-for="(langs, userId) in words">
            <li
              v-if="!checkEmptyWords(words[userId]) "
              :key="userId">
              <h3>
                <span
                  :class="show[userId] ? 'active' : ''"
                  class="user-id"
                  @click="show[userId] = !show[userId]">{{ userId }}</span>
              </h3>
              <template v-for="(list, lang) in langs" >
                <div
                  v-show="show[userId]"
                  v-if="Object.keys(list).length"
                  :key="lang"
                  class="lang-table-wrapp">
                  <table class="lang-table">
                    <tr>
                      <td colspan="5">
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
                    <template v-for="(desc, word, index) in list">
                      <tr
                        v-if="getWordExist(lang, word)"
                        :key="index"
                        class="word-exist">
                        <td colspan="5">
                          <div v-html="getWordExist(lang, word)"/>
                        </td>
                      </tr>
                      <tr :key="word">
                        <td>
                          <button
                            class="btn btn-copy"
                            @click="copyWord(word)">Copy</button>
                          <label>
                            <input
                              v-model="checkbox[userId][lang]"
                              :value="word"
                              type="checkbox"
                            >
                            <span>{{ word }}</span>
                          </label>
                          <label v-if="userId === 'admin'">
                            <input
                              :value="word"
                              type="text"
                              @change="changeAdminWord($event, lang, word)">
                          </label>
                        </td>
                        <td>
                          <label class="select-label">
                            <span>Genus</span>
                            <select @change="addGenus($event, userId, lang, word)">
                              <option
                                value=""
                                selected/>
                              <option
                                v-for="(genus, key) in genus[lang]"
                                :key="key"
                                :value="genus"
                              >{{ genus }}</option>
                            </select>
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
                    </template>
                    <tr v-if="userId === 'admin' && !words['admin'][lang].hasOwnProperty('слово')">
                      <td colspan="5">
                        <button
                          class="btn btn-add"
                          @click="addField(lang)">add field</button>
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
      words_ru: null,
      words_uk: null,
      checkbox: {},
      disabled: false,
      show: {},
      genus: {
        ru: ['м.', 'ж.', 'ср.'],
        uk: ['чол.', 'жін.', 'сер.']
      }
    }
  },
  beforeCreate: function () {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user.uid !== 'jeE2xoaMUzUf8uT3IcN0q157yPB3' && user.uid !== 'YtBJf2wUmGhD4wcyzW5RgncEMrU2') {
        // console.log(1)
        this.$router.push('/')
        return
      }
      let url = 'https://words-mincer.top/'
      if (location.port === '8080') {
        url = '/src/'
      }
      let data = Promise.all(
        [
          Func.getData(url + 'data/words_new.json', 'json', true),
          Func.getData(url + 'data/words_ru.json', 'json', true),
          Func.getData(url + 'data/words_uk.json', 'json', true)
        ]
      )
      data.then(result => {
        let wordsNew = result[0]
        this.words_ru = result[1]
        this.words_uk = result[2]
        this.checkbox = {}
        let admin = {'admin': {}}
        Object.keys(wordsNew).forEach(userId => {
          Object.keys(wordsNew[userId]).forEach(lang => {
            admin['admin'][lang] = {
              'слово': ''
            }
          })
        })
        wordsNew = Object.assign(admin, wordsNew)
        Object.keys(wordsNew).forEach(userId => {
          if (!this.checkbox[userId]) {
            this.$set(this.checkbox, userId, {})
          }
          if (userId === 'admin') {
            this.$set(this.show, userId, false)
          } else {
            this.$set(this.show, userId, true)
          }
          Object.keys(wordsNew[userId]).forEach(lang => {
            if (!this.checkbox[userId][lang]) {
              this.$set(this.checkbox[userId], lang, [])
            }
            if (userId === 'admin') return
            Object.keys(wordsNew[userId][lang]).forEach(word => {
              this.checkbox[userId][lang].push(word)
            })
          })
        })
        this.words = wordsNew
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
    copyWord (word) {
      let textarea = document.createElement('textarea')
      textarea.textContent = word
      textarea.style.position = 'fixed'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    },
    getWordExist (lang, word) {
      let key = 'words_' + lang
      let words = this[key][word.length]
      if (words.hasOwnProperty(word)) {
        return `<b>${word}</b> ${words[word]}`
      }
    },
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
    changeAdminWord (event, lang, word) {
      let value = event.target.value
      let words = this.words['admin'][lang]
      delete Object.assign(words, {
        [value]: words[word]
      })[word]
      this.words['admin'][lang] = Object.assign({}, words)
      let checkbox = this.checkbox['admin'][lang]
      checkbox = checkbox.filter(el => el !== word)
      checkbox.push(value)
      this.checkbox['admin'][lang] = checkbox
    },
    addField (lang) {
      this.words['admin'][lang] = Object.assign({}, this.words['admin'][lang], {'слово': ''})
    },
    addGenus (event, userId, lang, word) {
      let value = event.target.value
      let descArr = this.words[userId][lang][word].split('#')
      let desc
      if (descArr.length > 1) {
        if (!value) {
          descArr.splice(0, 2)
        } else {
          descArr[1] = value
        }
        desc = descArr.join('#')
      } else {
        if (descArr[0]) {
          desc = '#' + value + '#' + descArr[0]
        } else {
          desc = '#' + value + '#'
        }
      }
      this.words[userId][lang][word] = desc
    },
    putData (type, data) {
      if (type === 'add') {
        let desc = []
        data.words.forEach(word => {
          desc.push(this.words[data.userId][data.lang][word])
        })
        data.desc = desc.join('~~')
      }
      return Func.putData('deleteWords', data).then(result => {
        if (type === 'add') {
          return Func.putData('addWordsMaster', data)
        }
      })
    },
    addOrDelete (type, userId, lang, words) {
      let confirm = window.confirm('Are you sure?')
      if (!confirm) return
      this.disabled = true
      let data = {
        userId: userId,
        lang: lang,
        words: words
      }
      this.putData(type, data).then(result => {
        words.forEach(word => {
          delete this.$delete(this.words[data.userId][lang], word)
          let checkbox = this.checkbox[data.userId][lang]
          checkbox = checkbox.filter(el => el !== word)
          this.checkbox[data.userId][lang] = checkbox
        })
        if (userId === 'admin' && !Object.keys(this.words['admin'][data.lang]).length) {
          this.addField(lang)
        }
        this.disabled = false
      })
    },
    addOrDeleteAll (type) {
      let confirm = window.confirm('Are you sure?')
      if (!confirm) return
      this.disabled = true
      let putData = []
      Object.keys(this.checkbox).forEach(user => {
        Object.keys(this.checkbox[user]).forEach(lang => {
          if (this.checkbox[user][lang].length) {
            let data = {
              userId: user,
              lang: lang,
              words: this.checkbox[user][lang]
            }
            putData.push(this.putData(type, data))
            data.words.forEach(word => {
              delete this.words[data.userId][data.lang][word]
              this.checkbox[data.userId][data.lang] = []
            })
          }
        })
      })
      Promise.all(putData).then(result => {
        this.disabled = false
      })
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.users{
  &>li{
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
  @media @sm{
    display:block;
  }
  tbody,
  tr,
  td{
    @media @sm{
      display:block;
    }
  }
  tr{
    @media @sm{
      border:solid 1px @border;
      &:not(:last-child){
        margin-bottom:1rem;
      }
    }
  }
  td{
    padding:.5rem;
    vertical-align:bottom
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
.select-label{
  display:block;
}
select{
  cursor:pointer;
  display:block;
}
textarea{
  display:block;
  font-size:.875rem;
}
.word-exist{
  background-color:fade(@red,10%);
  &+tr{
    background-color:fade(@red,10%);
  }
}
.user-id{
  padding:.5rem 1.5rem .5rem .5rem;
  margin:0 -.5rem;
  position:relative;
  display:inline-block;
  cursor:pointer;
  user-select:none;
  &:after{
    position:absolute;
    content:'';
    right:0;
    top:50%;
    border-left:solid .5rem transparent;
    border-right:solid .5rem transparent;
    border-top:solid .5rem;
    margin-top:-.25rem;
    transition:.2s;
  }
  &.active{
    &:after{
      transform:rotate(-180deg);
    }
  }
}
.word-exist{
  font-size:.75rem;
}
.btn-copy{
  background-color:@yellow;
  transition:.2s;
  margin-bottom:2px;
  &:active{
    transform:translateY(2px);
  }
}
</style>
