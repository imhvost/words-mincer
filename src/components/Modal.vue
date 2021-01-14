<template>
  <div
    :class="isOpen ? 'active' : ''"
    class="modal"
    @click.stop="closeModal($event)">
    <div class="modal-body">
      <div class="modal-content">
        <button
          type="button"
          class="modal-close"
          @click="closeModal()"/>
        <h3 class="modal-title">{{ title }}</h3>
        <template v-if="type === 'words'">
          <ul
            v-if="words.length"
            class="modal-word-list">
            <li
              v-for="(word, key) in words"
              :key="key">
              <div class="modal-word-list-title">{{ word }}</div>
              <div
                class="modal-word-list-desc"
                v-html="descriptions[word]"/>
            </li>
          </ul>
          <div
            v-else
            class="modal-word-empty">
            {{ text.empty[lang] }}
          </div>
        </template>
        <template v-if="type === 'mistakes'">
          <template v-if="words.length">
            <div
              v-if="user.id === 'guest'"
              class="mistakes-add-alert">{{ text.addGuest[lang] }}</div>
            <div
              v-else
              class="mistakes-add-alert">{{ text.addAlert[lang] }}</div>
            <ul class="modal-word-list modal-word-list-mistakes">
              <li
                v-for="(word, key) in words"
                :key="key">
                <div class="modal-word-list-title">{{ word }}</div>
                <template v-if="user.id !== 'guest'">
                  <template v-if="add.indexOf(word) === -1">
                    <div class="modal-word-list-textarea">
                      <textarea
                        v-model="desc[key]"
                        :placeholder="text.addPlaceholder[lang]"/>
                    </div>
                    <div class="modal-word-list-btn">
                      <button
                        :disabled="disabled"
                        class="btn"
                        type="button"
                        @click="addWord(word, key)">{{ text.addBtn[lang] }}</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="modal-word-list-add">{{ text.addDone[lang] }}</div>
                  </template>
                </template>
              </li>
            </ul>
          </template>
          <div
            v-else
            class="modal-word-empty">
            {{ text.empty[lang] }}
          </div>
        </template>
        <template v-if="type === 'shop'">
          <shop @add-award="$emit('add-award', $event)"/>
        </template>
        <template v-if="type === 'awards'">
          <div class="awards">
            <div
              v-for="(award, key) in awards"
              :key="key"
              class="award active">
              <svg class="icon">
                <use :xlink:href="'#' + award.name"/>
              </svg>
              <div class="award-title">{{ award.title[lang] }}</div>
              <div class="award-desc">{{ decodeURIComponent(atob(award.desc[lang])) }}</div>
            </div>
          </div>
        </template>
        <template v-if="type === 'endGame'">
          <div class="end-game-desc">
            {{ text.endGame.desc[lang] }} <b>{{ score }}</b>
          </div>
          <div class="end-game-question">
            {{ text.endGame.question[lang] }}
          </div>
          <div class="end-game-btn-desc">
            {{ text.endGame.btnDesc[lang] }}
          </div>
          <button
            class="new-game-btn"
            @click="startNewGame()">
            <svg class="icon">
              <use xlink:href="#endGame"/>
            </svg>
            <span>{{ text.endGame.btn[lang] }}</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Func from '../js/functions.js'
import Shop from '../components/Shop.vue'

export default {
  components: {
    Shop
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    words: {
      type: Array,
      required: false,
      default: null
    },
    descriptions: {
      type: Object,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: true
    },
    awards: {
      type: Array,
      required: false,
      default: null
    },
    score: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data () {
    return {
      desc: [],
      add: [],
      disabled: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.components.modal
    }
  },
  methods: {
    atob (str) {
      return atob(str)
    },
    addWord (word, key) {
      this.$root.playAudio('click')
      this.disabled = true
      let desc = this.desc[key] || ''
      let data = {
        word: word,
        desc: desc,
        lang: this.lang,
        userId: this.user.id
      }
      Func.putData('addWord', data).then(result => {
        // console.log(result)
        this.add.push(word)
        this.disabled = false
        this.$emit('add')
      })
    },
    closeModal (event) {
      if (event) {
        if (event.target.classList.contains('modal-content') || event.target.closest('.modal-content')) return
      }
      this.$root.playAudio('click')
      this.$emit('close')
    },
    startNewGame () {
      this.$root.playAudio('click')
      this.$emit('start')
    }
  }
}
</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.modal{
  position:fixed;
  left:0;
  right:0;
  bottom:0;
  top:0;
  background-color:rgba(33,33,33,.7);
  display:flex;
  flex-direction:column;
  justify-content:center;
  opacity:0;
  visibility:hidden;
  transition:opacity .4s,visibility .4s;
  pointer-events:none;
  z-index:-6;
  &.active{
    opacity:1;
    visibility:visible;
    z-index:666666;
    pointer-events:auto;
  }
}
.modal-body{
  flex:none;
  max-height:100%;
  overflow-y:auto;
  overflow-x:hidden;
}
.modal-content{
  width:42.8571rem;
  max-width:90%;
  max-width:~'calc(100% - 2.1429rem)';
  background-color:#fff;
  padding:2.8571rem;
  position:relative;
  margin:1.4286rem auto;
  background:linear-gradient(90deg,#f1f1f1 1px,#f9f9f9 1px);
  background-size:5px 5px;
  @media @sm{
    padding:2.8571rem 1.4286rem;
  }
}
.modal-close{
  position:absolute;
  width:2.8571rem;
  height:2.8571rem;
  border:0;
  background:none;
  right:0.3571rem;
  top:0.3571rem;
  &:before,
  &:after{
    content:'';
    position:absolute;
    left:50%;
    width:1.1429rem;
    top:50%;
    height:0.1429rem;
    margin:-0.0714rem 0 0 -0.5714rem;
    background-color:currentColor;
  }
  &:before{
    transform:rotate(45deg);
  }
  &:after{
    transform:rotate(-45deg);
  }
}
.modal-title{
  font-size:1.7143rem;
  text-transform:uppercase;
  margin-bottom:1.4286rem;
}
.modal-word-list{
  margin-bottom:-1.0714rem;
  li{
    padding-bottom:1.0714rem;
  }
}
.modal-word-list-title{
  font-weight:700;
}
.modal-word-list-desc{
  font-size:0.9286rem;
}
.mistakes-add-alert{
  padding:0.7143rem;
  font-size:0.9286rem;
  background-color:lighten(@red,30%);
  margin-bottom:1.4286rem;
}
.modal-word-list-mistakes{
  li{
    &:not(:last-child){
      padding-bottom:1rem;
      margin-bottom:1rem;
      border-bottom:solid 1px @border;
    }
  }
  .btn{
    padding:.25rem 1rem;
    border:0;
    background-color:@green;
    color:#fff;
    &[disabled]{
      pointer-events:none;
    }
  }
}
.modal-word-list-textarea{
  margin:0.3571rem 0;
  textarea{
    width:100%;
    padding:0.7143rem 1.0714rem;
    resize:none;
  }
}
.awards{
  margin:0 -0.7143rem -2.1429rem;
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
}
.award{
  width:33.333%;
  padding:0 0.7143rem 2.1429rem;
  text-align:center;
  &.active{
    .icon,
    .award-title{
      opacity:1;
    }
  }
  @media @sm{
    width:50%;
  }
  .icon{
    width:8.5714rem;
    height:8.5714rem;
    margin:0 auto 0.7143rem;
    opacity:.1;
  }
}
.award-title{
  font-weight:700;
  opacity:.4;
}
.end-game-desc{
  margin-bottom:1.5rem;
  font-size:1.125rem;
  b{
    color:@green;
  }
}
.end-game-question{
  text-transform:uppercase;
  margin-bottom:1.5rem;
}
.end-game-btn-desc{
  margin-bottom:1.5rem;
}
.new-game-btn{
  background:none;
  border:0;
  display:flex;
  align-items:center;
  font-size:1.25rem;
  use{
    fill:@green;
  }
  .icon{
    width:2.5rem;
    height:2.5rem;
    margin-right:.3125rem;
  }
}
</style>
