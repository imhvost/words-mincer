<template>
  <div class="share">
    <div class="share-list-title">{{ text.title[lang] }}</div>
    <ul class="share-list">
      <li>
        <a
          href="#"
          @click.prevent="share('facebook')">
          <svg class="icon">
            <use xlink:href="#facebook"/>
          </svg>
          <span>facebook</span>
        </a>
      </li>
      <li>
        <a
          href="#"
          @click.prevent="share('telegram')">
          <svg class="icon">
            <use xlink:href="#telegram"/>
          </svg>
          <span>telegram</span>
        </a>
      </li>
      <li>
        <a
          href="#"
          @click.prevent="share('twitter')">
          <svg class="icon">
            <use xlink:href="#twitter"/>
          </svg>
          <span>twitter</span>
        </a>
      </li>
      <li>
        <a
          href="#"
          @click.prevent="share('vk')">
          <svg class="icon">
            <use xlink:href="#vk"/>
          </svg>
          <span>vk</span>
        </a>
      </li>
      <li>
        <a
          href="#"
          @click.prevent="share('whatsapp')">
          <svg class="icon">
            <use xlink:href="#whatsapp"/>
          </svg>
          <span>whatsapp</span>
        </a>
      </li>
      <li>
        <a
          href="#"
          @click.prevent="share('odnoklassniki')">
          <svg class="icon">
            <use xlink:href="#odnoklassniki"/>
          </svg>
          <span>ok</span>
        </a>
      </li>
    </ul>
    <modal
      v-if="modalAwards.length"
      :is-open="modalOpen.awards"
      :title="modalAwards.length === 1 ? text.awards[0][lang] : text.awards[1][lang]"
      :type="'awards'"
      :awards="modalAwards"
      @close="modalOpen.award = false; modalAwards = []"
    />
  </div>
</template>

<script>
import Modal from './Modal.vue'
import {mapState} from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  components: {
    Modal
  },
  data () {
    return {
      modalOpen: {
        awards: false
      },
      modalAwards: []
    }
  },
  computed: {
    ...mapState(['user', 'awardsList', 'settings']),
    userData () {
      return this.$store.state.userData[this.user.id][this.settings.lang]
    },
    awards () {
      return this.$store.state.userData[this.user.id].awards
    },
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.components.share
    }
  },
  methods: {
    share (type) {
      this.$root.playAudio('click')
      let url = 'https://words-mincer.top/share.php'
      if (location.port === '8080') {
        url = 'http://localhost/work/words/share.php'
      }
      if (this.user) this.addAward('adviser')
      let href
      if (this.$route.params.id) {
        let ref = firebase.database().ref(`users/${this.$route.params.id}/profile`)
        ref.once('value', (snap) => {
          let user = snap.val()
          href = `${url}?share=${type}&page=${this.$route.name}&lang=${this.settings.lang}&user=${this.$route.params.id}&userName=${user.name}&userImg=${user.img}`
        })
      } else if (this.$route.name === 'game') {
        href = `${url}?share=${type}&page=${this.$route.name}&lang=${this.settings.lang}&level=${this.userData.taskLevel}&sublevel=${this.userData.taskSublevel}`
      } else {
        href = `${url}?share=${type}&page=${this.$route.name}&lang=${this.settings.lang}`
      }
      window.open(href, '_blank')
    },
    addAward (award) {
      if (this.awards.received.indexOf(award) !== -1) return
      this.$root.playAudio('award')
      this.awards.received.push(award)
      let firebaseDataAwards = {
        userId: this.user.id,
        received: this.awards.received
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
.share{
  padding:0.7143rem 0;
  border-top:solid 0.0714rem #ccc;
  background: repeating-linear-gradient(60deg, #f1f1f1, #f1f1f1 2px,#f9f9f9 2px,#f9f9f9 6px);
  align-self:stretch;
  margin:auto -1.0714rem -3.75rem;
}
.share-list-title{
  text-align:center;
  margin-bottom:0.3571rem;
}
.share-list{
  display:flex;
  text-align:center;
  justify-content:space-around;
  align-self:stretch;
  a{
    display:block;
    padding:0.3571rem;
  }
  .icon{
    width:2.1429rem;
    height:2.1429rem;
    display:block;
    margin:auto;
  }
  span{
    font-size:0.8571rem;
    color:@text;
    display:block;
  }
}
.level-done-body+.share{
  margin-left:0;
  margin-right:0;
  background:linear-gradient(90deg,#f1f1f1 1px,#f9f9f9 1px);
  background-size:5px 5px;
}
</style>
