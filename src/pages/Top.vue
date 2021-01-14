<template>
  <div class="page-content">
    <loading :loading="!list.length && $root.onLine">
      {{ text.loading[lang] }}
    </loading>
    <div class="container">
      <back-btn/>
      <template v-if="$root.onLine">
        <h2 class="page-title">{{ text.title[lang] }}</h2>
        <ul class="top-list">
          <template v-for="(user, index) in list">
            <li
              v-if="user.data.profile"
              :key="index">
              <router-link
                :to="`/user/${user.id}/${$store.state.settings.lang}`"
                :class="user.id === userId ? 'is-me' : ''"
                class="profile-cabinet"
                exact
                tag="button"
                @click.native="$root.playAudio('click')">
                <b>#{{ ++index }}</b>
                <img
                  v-if="user.data.profile.img"
                  :src="user.data.profile.img"
                  alt="Avatar">
                <span v-if="user.data.profile.name">{{ user.data.profile.name }}</span>
                <span v-else>{{ text.anonymous[lang] }}</span>
                <svg class="icon">
                  <use xlink:href="#star"/>
                </svg>
                <b>{{ Math.max(...user.data[$store.state.settings.lang].history) }}</b>
              </router-link>
            </li>
          </template>
          <template v-if="!isTop && userId">
            <li>...</li>
            <li>
              <router-link
                :to="`/user/${userId}/${$store.state.settings.lang}`"
                class="profile-cabinet is-me"
                exact
                tag="button"
                @click.native="$root.playAudio('click')">
                <b>#??</b>
                <img
                  v-if="$store.state.user.img"
                  :src="$store.state.user.img"
                  alt="Avatar">
                <span v-if="userId === 'guest'">{{ text.guest[lang] }}</span>
                <span v-else>{{ $store.state.user.name }}</span>
                <svg class="icon">
                  <use xlink:href="#star"/>
                </svg>
                <b>{{ Math.max(...$store.state.userData[userId][$store.state.settings.lang].history) }}</b>
              </router-link>
            </li>
          </template>
        </ul>
      </template>
      <div v-else>{{ text.offline[lang] }}</div>
      <share/>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
// import firebaseApp from '../js/firebase.js'
import Loading from '../components/Loading.vue'
import BackBtn from '../components/BackBtn.vue'
import Share from '../components/Share.vue'

export default {
  components: {
    Loading,
    BackBtn,
    Share
  },
  data () {
    return {
      list: [],
      isTop: false,
      userId: null
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$root.playAudio('click')
    next()
  },
  computed: {
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.page.top
    }
  },
  mounted: function () {
    let user = this.$store.state.user
    if (user) this.userId = user.id
    let ref = firebase.database().ref('users')
    let list = []
    ref.orderByChild(`${this.lang}/history/`).limitToLast(20).on('child_added', (data) => {
      let userData = data.val()
      if (!userData.profile || !userData[this.lang].history) return
      list.push({
        id: data.key,
        data: userData
      })
      this.loading = false
    })
    ref.once('value', (snap) => {
      list.sort((a, b) => {
        if (!a.data || !b.data) return
        let aMax = Math.max(...a.data[this.lang].history)
        let bMax = Math.max(...b.data[this.lang].history)
        return aMax - bMax
      })
      this.list = list.reverse()
      this.list.forEach(el => {
        if (el.id === this.userId) this.isTop = true
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
.page-content{
  flex:auto;
  display:flex;
  flex-direction:column;
  .container{
    flex:auto;
    display:flex;
    flex-direction:column;
  }
}
.profile-cabinet{
  display:flex;
  align-items:center;
  color:inherit;
  transition:.4s;
  padding:0.3571rem;
  img{
    width:2.5rem;
    height:2.5rem;
    border-radius:50%;
    flex:none;
  }
  span{
    margin:0 0.7143rem;
  }
  .icon{
    width:1.4286rem;
    height:1.4286rem;
    flex:none;
    margin-right:0.3571rem;
  }
  b{
    margin-right:0.3571rem;
    min-width:2rem;
  }
  &.is-me{
    background:repeating-linear-gradient(-60deg, #f1f1f1, #f1f1f1 2px,#f9f9f9 2px,#f9f9f9 6px);
    border:solid 1px #ccc;
  }
}
.top-list{
  margin-bottom:1.0714rem;
  li+li{
    margin-top:0.3571rem;
  }
}
</style>
