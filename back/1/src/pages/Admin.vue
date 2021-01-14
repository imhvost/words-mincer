<template>
  <div class="page-content">
    <div v-if="words">
      <ul>
        <li
          v-for="(user, key) in words"
          :key="key">
          <h3>{{ key }}</h3>
          <table>
            <tr
              v-for="(desc, word) in user"
              :key="word">
              <td>{{ word }}</td>
              <td>
                <textarea v-html="desc"/>
              </td>
              <td>
                <button>add</button>
              </td>
            </tr>
          </table>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Func from '../js/functions.js'

export default {
  components: {},
  data () {
    return {
      words: null
    }
  },
  mounted: function () {
    let data = Promise.all(
      [
        Func.getData('http://words.imhvost.top/data/words_ru_new.json', 'json')
      ]
    )
    data.then(result => {
      this.words = result[0]
      console.log(this.words)
      let data = {
        json: JSON.stringify(this.words),
        fileName: 'words_ru_new.json'
      }
      Func.putData('saveFile', data).then(result => {
        // console.log(result)
        console.log(result)
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
