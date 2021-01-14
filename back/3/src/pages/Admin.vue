<template>
  <div class="page-content">
    <div v-if="words">
      <ul>
        <li
          v-for="(langs, key) in words"
          :key="key">
          <h3>{{ key }}</h3>
          <template v-for="(list, lang) in langs">
            <table
              v-if=" Object.keys(list).length"
              :key="lang">
              <tr>
                <td colspan="4">{{ lang }}</td>
              </tr>
              <tr
                v-for="(desc, word) in list"
                :key="word">
                <td>{{ word }}</td>
                <td>
                  <textarea v-html="desc"/>
                </td>
                <td>
                  <button>add</button>
                </td>
                <td>
                  <button>delete</button>
                </td>
              </tr>
            </table>
          </template>
        </li>
      </ul>
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
      words: null
    }
  },
  mounted: function () {
    firebaseApp.auth().onAuthStateChanged((user) => {
      // console.log(user.uid)
      if (user.uid !== 'jeE2xoaMUzUf8uT3IcN0q157yPB3') {
        // console.log(1)
        this.$router.push('/')
        return
      }
      let url = 'https://words-mincer.top/'
      if (location.port === '8080') {
        url = 'http://localhost/work/words/src/'
      }
      let data = Promise.all(
        [
          Func.getData(url + 'data/words_new.json', 'json')
        ]
      )
      data.then(result => {
        this.words = result[0]
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
    //
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
</style>
