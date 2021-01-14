<template>
  <div class="page-user">
    <loading :loading="loadingWords || !userData">
      <div v-if="loadingWords">{{ text.loadData[lang] }}</div>
      <div v-if="!userData">{{ text.loadUser[lang] }}</div>
    </loading>
    <modal
      v-if="settings"
      :is-open="modalOpen.shop"
      :title="text.modalTitles.shop[lang]"
      :type="'shop'"
      @close="modalOpen.shop = false"
      @add-award="addAward($event)"
    />
    <modal
      v-if="modalAwards.length"
      :is-open="modalOpen.awards"
      :title="modalAwards.length === 1 ? text.modalTitles.awards[0][lang] : text.modalTitles.awards[1][lang]"
      :type="'awards'"
      :awards="modalAwards"
      @close="modalOpen.award = false; modalAwards = []"
    />
    <div class="container">
      <div class="user-body">
        <back-btn/>
        <button
          v-if="settings"
          class="user-shop-btn"
          type="button"
          @click="modalOpen.shop = true; $root.playAudio('click')">
          <svg class="icon">
            <use xlink:href="#shop"/>
          </svg>
          <span>{{ text.modalTitles.shop[lang] }}</span>
        </button>
        <ul class="tabs-nav">
          <li v-if="settings">
            <button
              :class="tabActive === 1 ? 'active' : ''"
              type="button"
              @click="tabActive = 1; $root.playAudio('click')">{{ text.tabs.settings[lang] }}</button>
          </li>
          <li>
            <button
              :class="tabActive === 2 ? 'active' : ''"
              type="button"
              @click="tabActive = 2; $root.playAudio('click')">{{ text.tabs.info[lang] }}</button>
          </li>
          <li>
            <button
              :class="tabActive === 3 ? 'active' : ''"
              type="button"
              @click="tabActive = 3; $root.playAudio('click')">{{ text.tabs.awards[lang] }}</button>
          </li>
        </ul>
        <div
          v-if="settings"
          :class="tabActive === 1 ? 'active' : ''"
          class="tab-block">
          <div class="settings">
            <div class="setting">
              <div class="setting-title">{{ text.settings.lang.title[lang] }}</div>
              <ul class="setting-radios">
                <li :class="!onLine && settings.lang !== 'ru' ? 'disabled' : ''">
                  <label
                    :class="settings.lang === 'ru' ? 'active' : ''"
                    class="setting-radio-label">
                    <input
                      :checked="settings.lang === 'ru' ? true : false"
                      type="radio"
                      name="lang"
                      value="ru"
                      @click="$root.playAudio('click')"
                      @change="changeSettings($event, 'lang')">
                    <svg class="icon">
                      <use xlink:href="#ru"/>
                    </svg>
                    <span>{{ text.settings.lang.values[0][lang] }}</span>
                  </label>
                </li>
                <li :class="!onLine && settings.lang !== 'uk' ? 'disabled' : ''">
                  <label
                    :class="settings.lang === 'uk' ? 'active' : ''"
                    class="setting-radio-label">
                    <input
                      :checked="settings.lang === 'uk' ? true : false"
                      type="radio"
                      name="lang"
                      value="uk"
                      @click="$root.playAudio('click')"
                      @change="changeSettings($event, 'lang')">
                    <svg class="icon">
                      <use xlink:href="#uk"/>
                    </svg>
                    <span>{{ text.settings.lang.values[1][lang] }}</span>
                  </label>
                </li>
              </ul>
            </div>
            <div class="setting">
              <div class="setting-title">{{ text.settings.audio.title[lang] }}</div>
              <ul class="setting-radios">
                <li>
                  <label
                    :class="settings.audio === 'on' ? 'active' : ''"
                    class="setting-radio-label">
                    <input
                      :checked="settings.audio === 'on' ? true : false"
                      type="radio"
                      name="audio"
                      value="on"
                      @click="$root.playAudio('click')"
                      @change="changeSettings($event, 'audio')">
                    <svg class="icon">
                      <use xlink:href="#audio"/>
                    </svg>
                    <span>{{ text.settings.audio.values[0][lang] }}</span>
                  </label>
                </li>
                <li>
                  <label
                    :class="settings.audio === 'off' ? 'active' : ''"
                    class="setting-radio-label setting-radio-label-off">
                    <input
                      :checked="settings.audio === 'off' ? true : false"
                      type="radio"
                      name="audio"
                      value="off"
                      @click="$root.playAudio('click')"
                      @change="changeSettings($event, 'audio')">
                    <svg class="icon">
                      <use xlink:href="#audio"/>
                    </svg>
                    <span>{{ text.settings.audio.values[1][lang] }}</span>
                  </label>
                </li>
              </ul>
            </div>
            <div class="setting setting-full">
              <div class="setting-title">{{ text.settings.enter.title[lang] }}</div>
              <ul class="setting-radios">
                <li>
                  <label
                    :class="settings.input === 'draw' ? 'active' : ''"
                    class="setting-radio-label">
                    <input
                      :checked="settings.input === 'draw' ? true : false"
                      type="radio"
                      name="input"
                      value="draw"
                      @click="$root.playAudio('click')"
                      @change="changeSettings($event, 'input')">
                    <svg class="icon">
                      <use xlink:href="#draw"/>
                    </svg>
                    <span>{{ text.settings.enter.values[0][lang] }}</span>
                  </label>
                </li>
                <li>
                  <label
                    :class="settings.input === 'press' ? 'active' : ''"
                    class="setting-radio-label">
                    <input
                      :checked="settings.input === 'press' ? true : false"
                      type="radio"
                      name="input"
                      value="press"
                      @click="$root.playAudio('click')"
                      @change="changeSettings($event, 'input')">
                    <svg class="icon">
                      <use xlink:href="#press"/>
                    </svg>
                    <span>{{ text.settings.enter.values[1][lang] }}</span>
                  </label>
                </li>
                <li>
                  <label
                    :class="settings.input === 'input' ? 'active' : ''"
                    class="setting-radio-label">
                    <input
                      :checked="settings.input === 'input' ? true : false"
                      type="radio"
                      name="input"
                      value="input"
                      @click="$root.playAudio('click')"
                      @change="changeSettings($event, 'input')">
                    <svg class="icon">
                      <use xlink:href="#input"/>
                    </svg>
                    <span>{{ text.settings.enter.values[2][lang] }}</span>
                  </label>
                </li>
              </ul>
            </div>
            <div
              v-if="userData.history[userData.history.length - 1]"
              class="setting setting-full">
              <div class="setting-title">{{ text.settings.reset.title[lang] }}</div>
              <button
                class="reset-btn"
                @click="reset()">
                <svg class="icon">
                  <use xlink:href="#endGame"/>
                </svg>
                <span>{{ text.settings.reset.btn[lang] }}</span>
              </button>
            </div>
          </div>
        </div>
        <div
          :class="tabActive === 2 ? 'active' : ''"
          class="tab-block">
          <table
            v-if="userData && user"
            class="user-table">
            <tr v-if="user.img">
              <td>{{ text.table.img[lang] }}</td>
              <td>
                <img
                  :src="user.img"
                  alt="Avatar"
                  class="user-img">
              </td>
            </tr>
            <tr v-if="user.name">
              <td>{{ text.table.name[lang] }}</td>
              <td>{{ user.name }}</td>
            </tr>
            <tr>
              <td>{{ text.table.lang[lang] }}</td>
              <td>
                <ul class="user-table-lang">
                  <li :class="$route.params.lang === 'ru' ? 'active' : ''">
                    <a
                      href="#"
                      @click.prevent="changeRouteLang('ru'); $root.playAudio('click')">ru</a>
                  </li>
                  <li :class="$route.params.lang === 'uk' ? 'active' : ''">
                    <a
                      href="#"
                      @click.prevent="changeRouteLang('uk'); $root.playAudio('click')">uk</a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>{{ text.table.history[lang] }}</td>
              <td>{{ userData.history.length }}</td>
            </tr>
            <tr>
              <td>{{ text.table.best[lang] }}</td>
              <td>{{ Math.max(...userData.history) }}</td>
            </tr>
            <template v-if="!loadingWords">
              <tr>
                <td colspan="2"><b>{{ text.table.current[lang] }}</b></td>
              </tr>
              <tr>
                <td>{{ text.table.level[lang] }}</td>
                <td>{{ userData.taskLevel }} / {{ userData.taskSublevel }}</td>
              </tr>
              <tr>
                <td>{{ text.table.score[lang] }}</td>
                <td>{{ userData.common.coins }}</td>
              </tr>
              <tr>
                <td>{{ text.table.coins[lang] }}</td>
                <td>{{ userData.coins }}</td>
              </tr>
              <tr>
                <td>{{ text.table.time[lang] }}</td>
                <td>{{ formatTime(userData.common.time) }}</td>
              </tr>
              <tr>
                <td>{{ text.table.answers[lang] }}</td>
                <td>{{ userData.common.answers }}</td>
              </tr>
              <tr>
                <td>{{ text.table.treasure[lang] }}</td>
                <td>{{ userData.common.treasure }}</td>
              </tr>
              <tr>
                <td>{{ text.table.errors[lang] }}</td>
                <td>{{ userData.common.errors }}</td>
              </tr>
              <tr>
                <td>{{ text.table.strike[lang] }}</td>
                <td>{{ userData.common.strike }}</td>
              </tr>
              <tr>
                <td>{{ text.table.counterdown[lang] }}</td>
                <td>{{ userData.common.counterdown }}</td>
              </tr>
              <tr>
                <td>{{ text.table.helpers[lang] }}</td>
                <td>{{ commonHelpers }}</td>
              </tr>
              <tr>
                <td>{{ text.table.bonus[lang] }}</td>
                <td>{{ userData.common.bonus }}</td>
              </tr>
            </template>
          </table>
          <div v-else>{{ text.error[lang] }}</div>
        </div>
        <div
          :class="tabActive === 3 ? 'active' : ''"
          class="tab-block">
          <div
            v-if="userData"
            class="awards">
            <div
              v-for="(award, key) in awardsList"
              :key="key"
              :class="awards.includes(award.name) ? 'active' : ''"
              class="award">
              <svg class="icon">
                <use :xlink:href="'#' + award.name"/>
              </svg>
              <div class="award-title">{{ award.title[lang] }}</div>
              <div
                v-if="settings && awards.includes(award.name)"
                class="award-desc">{{ decodeURIComponent(atob(award.desc[lang])) }}</div>
            </div>
          </div>
        </div>
      </div>
      <share/>
    </div>
  </div>
</template>

<script>
import Func from '../js/functions.js'
import Loading from '../components/Loading.vue'
import BackBtn from '../components/BackBtn.vue'
import Modal from '../components/Modal.vue'
import Share from '../components/Share.vue'
import firebaseApp from '../js/firebase.js'
import firebase from 'firebase/app'
import 'firebase/database'
import userConfig from '../data/user.json'

export default {
  components: {
    Modal,
    Loading,
    BackBtn,
    Share
  },
  data () {
    return {
      loadingWords: false,
      settings: null,
      userData: null,
      user: null,
      tabActive: 0,
      onLine: navigator.onLine,
      userConfig: userConfig,
      modalOpen: {
        shop: false,
        awards: false
      },
      modalAwards: [],
      awards: []
    }
  },
  computed: {
    awardsList () {
      return this.$store.state.awardsList
    },
    commonHelpers () {
      let count = 0
      if (this.userData) {
        let helpers = this.userData.common.helpers
        Object.keys(helpers).forEach(el => {
          count += helpers[el]
        })
      }
      return count || 0
    },
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.page.user
    }
  },
  mounted: function () {
    firebaseApp.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (user.uid === this.$route.params.id) {
          this.tabActive = 1
          this.settings = this.$store.state.settings
          this.user = this.$store.state.user
          this.userData = this.$store.state.userData[this.user.id][this.$route.params.lang]
          this.awards = this.$store.state.userData[this.user.id].awards.received
        } else {
          this.showUserProfile()
        }
      } else {
        this.showUserProfile()
      }
    }.bind(this))
  },
  beforeRouteUpdate (to, from, next) {
    if (this.user.id === to.params.id) {
      this.userData = this.$store.state.userData[this.user.id][to.params.lang]
    } else {
      this.userData = null
      firebase.database().ref(`users/${to.params.id}/${to.params.lang}`).on('value', (data) => {
        this.userData = data.val()
      })
    }
    next()
  },
  beforeRouteLeave (to, from, next) {
    let modals = Object.keys(this.modalOpen)
    for (let i = 0; i < modals.length; i++) {
      let element = modals[i]
      if (this.modalOpen[element]) {
        this.modalOpen[element] = false
        this.$root.playAudio('click')
        next(false)
        return
      }
    }
    next()
  },
  methods: {
    atob (str) {
      return atob(str)
    },
    showUserProfile () {
      this.tabActive = 2
      firebase.database().ref(`users/${this.$route.params.id}/${this.$route.params.lang}`).on('value', (data) => {
        this.userData = data.val()
      })
      firebase.database().ref(`users/${this.$route.params.id}/profile`).on('value', (data) => {
        this.user = data.val()
      })
      firebase.database().ref(`users/${this.$route.params.id}/awards`).on('value', (data) => {
        if (data.val()) this.awards = data.val().received
      })
    },
    changeSettings (event, key) {
      let target = event.target
      let value = target.value
      this.settings[key] = value
      this.$store.commit('SET_SETTINGS', this.settings)
      if (key === 'lang') {
        this.changeRouteLang(value)
        this.loadingWords = true
        let wordsFile = `/data/words_${value}.json`
        let data = Func.getData(wordsFile, 'json')
        data.then(result => {
          this.$store.commit('SET_WORDS', result)
          this.$store.commit('SET_TASK', '')
          this.$store.commit('SET_SHUFFLED_TASK', [])
          // this.$store.commit('SET_CURRENT_COUNTERDOWN', false)
          this.$store.commit('SET_GAME', null)
          this.$store.commit('SET_ANSWERS_ALL', null)
          this.$store.commit('SET_ANSWERS', null)
          this.loadingWords = false
          this.userData = this.$store.state.userData[this.user.id][value]
        })
      }
    },
    formatTime (time) {
      let date = new Date(null)
      date.setMilliseconds(time)
      return date.toISOString().substr(11, 8)
    },
    changeRouteLang (lang, audio) {
      this.$router.replace({
        params: {
          lang: lang
        }
      })
    },
    reset () {
      let conf = confirm(this.text.settings.reset.confirm[this.lang])
      if (conf) {
        let history = this.userData.history
        history.push(0)
        let userData = this.userConfig[this.lang]
        userData.history = history
        this.$store.dispatch('UPDATE_USER_DATA', {
          userId: this.user.id,
          lang: this.lang,
          props: userData
        })
        this.$store.commit('SET_USER_DATA_LANG', {
          id: this.user.id,
          lang: this.lang,
          data: userData
        })
        this.$store.commit('SET_TASK', '')
        this.$store.commit('SET_SHUFFLED_TASK', [])
        // this.$store.commit('SET_CURRENT_COUNTERDOWN', false)
        this.$store.commit('SET_GAME', null)
        this.$store.commit('SET_ANSWERS_ALL', null)
        this.$store.commit('SET_ANSWERS', null)
      }
    },
    addAward (award) {
      let userAwards = this.$store.state.userData[this.user.id].awards
      if (userAwards.received.indexOf(award) !== -1) return
      this.$root.playAudio('award')
      userAwards.received.push(award)
      let firebaseDataAwards = {
        userId: this.user.id,
        received: userAwards.received
      }
      this.$store.dispatch('UPDATE_USER_AWARDS', firebaseDataAwards)
      let awardData = this.awardsList.find(x => x.name === award)
      this.modalAwards.push(awardData)
      setTimeout(() => {
        if (!this.modalOpen.awards) this.modalOpen.awards = true
      }, 200)
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.page-user{
  flex:auto;
  display:flex;
  flex-direction:column;
  .container{
    flex:auto;
    display:flex;
    flex-direction:column;
  }
}
.user-body{
  padding-bottom:1.0714rem;
}
.tabs-nav{
  margin-bottom:2.1429rem;
  border-bottom:solid 0.0714rem #ccc;
  display:flex;
  button{
    border:solid 0.0714rem #ccc;
    margin-bottom:-0.0714rem;
    border-radius:0.7143rem 0.7143rem 0 0;
    padding:0.5714rem 1.0714rem;
    background-color:#fff;
    transition:.4s;
    &.active{
      color:#fff;
      background-color:@green;
      border-color:@green;
    }
  }
  li{
    &:not(:last-child){
      margin-right:0.3571rem;
    }
  }
}
.tab-block{
  height:0;
  overflow:hidden;
  opacity:0;
  visibility:hidden;
  &.active{
    height:auto;
    overflow:visible;
    opacity:1;
    visibility:visible;
    transition:opacity .4s,visibility .4s;
  }
}
.settings{
  margin:0 -1.0714rem -2.1429rem;
  display:flex;
  flex-wrap:wrap;
}
.setting{
  width:50%;
  padding:0 1.0714rem 2.1429rem;
}
.setting-title{
  font-size:1.1429rem;
  margin-bottom:0.7143rem;
  font-weight:700;
}
.setting-radios{
  display:flex;
  margin:0 -0.7143rem;
  li{
    padding:0 0.7143rem;
    &.disabled{
      opacity:.2;
      pointer-events:none;
    }
  }
}
.setting-radio-label{
  display:block;
  cursor:pointer;
  user-select:none;
  transition:.4s;
  position:relative;
  &:after{
    content:'\2713';
    position:absolute;
    width:1.4286rem;
    height:1.4286rem;
    border-radius:50%;
    background-color:@green;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
    color:#fff;
    line-height:1;
    right:0;
    top:0;
    opacity:0;
    transition:.4s;
  }
  input{
    display:none;
  }
  .icon{
    width:2.8571rem;
    height:2.8571rem;
    display:block;
    margin:auto;
  }
  use{
    opacity:.5;
    transition:.4s;
  }
  &.active{
    color:@red;
    use{
      opacity:1;
      fill:@red;
    }
    &:after{
      opacity:1;
    }
  }
  span{
    display:block;
    margin-top:0.3571rem;
    text-align:center;
    font-size:0.9286rem;
  }
}
.setting-radio-label-off{
  position:relative;
  &:before{
    content:'';
    position:absolute;
    z-index:1;
    width:3.5714rem;
    height:0.1429rem;
    top:1.2857rem;
    left:50%;
    margin-left:-1.7857rem;
    transform:rotate(45deg);
    background-color:#808080;
    transition:.4s;
  }
  &.active{
    &:before{
      background-color:@link;
    }
  }
}
.setting-full{
  width:100%;
}
.user-table{
  width:100%;
  td{
    padding:0 1.0714rem 1.0714rem 0;
    &:last-child{
      padding-right:0;
    }
    &:first-child{
      color:@placeholder;
      width:9.6429rem;
      b{
        color:@text;
      }
    }
  }
}
.user-img{
  width:3.5714rem;
  height:3.5714rem;
  border-radius:50%;
  display:block;
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
.user-shop-btn{
  border:0;
  background:none;
  position:absolute;
  right:1.0714rem;
  top:-2.5rem;
  display:flex;
  align-items:center;
  .icon{
    width:2.1429rem;
    height:2.1429rem;
    margin-right:0.7143rem;
  }
}
.user-table-lang{
  display:flex;
  margin:0 -1.0714rem;
  li{
    padding:0 0.7143rem;
    a{
      display:block;
      padding:0.3571rem;
      text-decoration:underline;
    }
    &.active{
      a{
        color:inherit;
        text-decoration:none;
        pointer-events:none;
      }
    }
  }
}
.reset-btn{
  background:none;
  border:0;
  display:flex;
  align-items:center;
  margin-top:1rem;
  use{
    fill:@red;
  }
  .icon{
    width:2.5rem;
    height:2.5rem;
    margin-right:.3125rem;
  }
}
</style>
