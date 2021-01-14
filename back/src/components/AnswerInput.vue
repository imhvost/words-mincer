<template>
  <ul class="answer-inputs">
    {{ helpers }}
    <li
      v-for="(letter, index) in answer.split('')"
      :key="index">
      <input
        :value="helpers[index]"
        :placeholder="answer[index]"
        maxlength="1"
        type="text"
        class="answer-input"
        @input="checkAnswer($event)">
    </li>
  </ul>
</template>

<script>

export default {
  props: {
    answer: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    helpers: {
      type: Array,
      required: true
    },
    answersAll: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  watch: {
    helpers: function (newHelpers, oldHelpers) {
      let helpers = newHelpers.join('')
      if (helpers === this.answer) this.$emit('answered', this.answer)
    }
  },
  methods: {
    checkAnswer (event) {
      let input = event.target
      let ul = input.closest('ul')
      let letters = []
      ul.querySelectorAll('.answer-input').forEach(el => {
        letters.push(el.value)
      })
      let wordLength = 0
      letters.forEach(element => {
        if (element) wordLength++
      })
      if (wordLength === this.answer.length) {
        let value = letters.join('')
        if (value === this.answer) {
          ul.classList.add('currect')
          this.$emit('answered', value)
          this.$emit('focus', this.index + 1)
        } else {
          let isAnswered = false
          Object.keys(this.answersAll).forEach(key => {
            let answersAll = this.answersAll[key]
            if (!answersAll) return
            answersAll.forEach(el => {
              if (el === value) {
                this.$emit('add-to-treasure', value)
                if (!isAnswered) isAnswered = true
              }
            })
          })
          if (!isAnswered) this.$emit('reset-strike', 'loss')
          ul.querySelectorAll('.answer-input').forEach(el => {
            el.value = ''
          })
          ul.querySelector('.answer-input').focus()
        }
        return
      }
      focus(input)
      function focus (target) {
        if (target.value && target.parentNode.nextSibling) {
          let input = target.parentNode.nextSibling.querySelector('.answer-input')
          if (input.value) return focus(input)
          input.focus()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.answer-inputs{
  display:flex;
  &.currect{
    pointer-events:none;
  }
}
.answer-input{
  width:30px;
  height:30px;
  text-align:center;
}
</style>
