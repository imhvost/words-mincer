<template>
  <div class="page-content home">
    <loading :loading="!isLoadData || $store.state.loadingUser || loadingUser">
      <div v-if="!isLoadData">{{ text.loadData[lang] }}</div>
      <div v-if="$store.state.loadingUser">{{ text.loadUser[lang] }}</div>
    </loading>
    <div class="container">
      <button
        v-if="isLocalhost"
        @click="reset">Reset</button>
      <h1 class="logo">
        <span>
          <i
            v-for="(letter, key) in text.logo[lang]"
            :key="key">{{ letter }}</i>
        </span>
      </h1>
      <div
        v-if="$store.state.user && $store.state.user.id !== 'guest'"
        class="profile">
        <router-link
          v-if="isLoadUser"
          :to="`/user/${$store.state.user.id}/${$store.state.settings.lang}`"
          class="profile-cabinet"
          exact
          tag="a"
          @click.native="$root.playAudio('click')">
          <img
            v-if="$store.state.user.img && onLine"
            :src="$store.state.user.img"
            alt="Avatar">
          <span class="profile-cabinet-user">
            <span class="profile-cabinet-user-name">{{ $store.state.user.name }}</span>
            <span class="profile-cabinet-user-info">
              <span class="profile-cabinet-user-info-block">
                <svg class="icon">
                  <use xlink:href="#level"/>
                </svg>
                <span>{{ $store.state.userData[$store.state.user.id][lang].taskLevel }}/{{ $store.state.userData[$store.state.user.id][lang].taskSublevel }}</span>
              </span>
              <span class="profile-cabinet-user-info-block">
                <svg class="icon">
                  <use xlink:href="#star"/>
                </svg>
                <span>{{ $store.state.userData[$store.state.user.id][lang].history[$store.state.userData[$store.state.user.id][lang].history.length - 1] }}</span>
              </span>
            </span>
          </span>
          <svg class="icon">
            <use xlink:href="#settings"/>
          </svg>
        </router-link>
        <div
          v-else
          class="loading-icon loading-icon-profile">
          <i/><i/><i/>
        </div>
        <button
          type="button"
          class="btn btn-sign-out"
          @click="signOut">
          <span>{{ text.exit[lang] }}</span>
          <svg class="icon">
            <use xlink:href="#skip"/>
          </svg>
        </button>
        <router-link
          v-if="isLoadData && isLoadUser"
          class="btn btn-play"
          exact
          tag="a"
          to="/game"
          @click.native="$root.playAudio('click')">
          <span>
            <i
              v-for="(letter, key) in text.play[lang]"
              :key="key">{{ letter }}</i>
          </span>
          <svg class="icon">
            <use xlink:href="#play"/>
          </svg>
        </router-link>
        <div
          v-else
          class="loading-icon loading-icon-all">
          <i/><i/><i/>
        </div>
      </div>
      <div
        v-if="isNotRegister"
        class="enter-block">
        <div class="enter-block-title">{{ text.enterTitle[lang] }}</div>
        <ul class="enter-btns">
          <li>
            <button
              type="button"
              class="btn btn-sign-in btn-sign-in-with-google"
              @click="signInWithGoogle">
              <span>{{ text.enter[lang] }} <b>Google</b></span>
              <svg class="icon">
                <use xlink:href="#google"/>
              </svg>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="btn btn-sign-in btn-sign-in-with-facebook"
              @click="signInWithFacebook">
              <span>{{ text.enter[lang] }} <b>Facebook</b></span>
              <svg class="icon">
                <use xlink:href="#facebook"/>
              </svg>
            </button>
          </li>
          <!-- <button @click="isEmailAuthMethod = !isEmailAuthMethod">Sign in with Email</button> -->
        </ul>
        <router-link
          class="btn btn-play btn-play-small"
          exact
          tag="a"
          to="/game"
          @click.native="$root.playAudio('click')">
          <span>
            <i
              v-for="(letter, key) in text.playGuest[lang]"
              :key="key">{{ letter }}</i>
          </span>
          <svg class="icon">
            <use xlink:href="#play"/>
          </svg>
        </router-link>
      </div>
      <ul class="info-btns">
        <li>
          <router-link
            class="btn btn-top"
            exact
            tag="a"
            to="/top"
            @click.native="$root.playAudio('click')">
            <span>{{ text.top[lang] }}</span>
            <svg class="icon">
              <use xlink:href="#pedestal"/>
            </svg>
          </router-link>
        </li>
        <li>
          <router-link
            class="btn btn-instruction"
            exact
            tag="a"
            to="/instruction"
            @click.native="$root.playAudio('click')">
            <span>{{ text.instruction[lang] }}</span>
            <svg class="icon">
              <use xlink:href="#instruction"/>
            </svg>
          </router-link>
        </li>
      </ul>
      <button
        v-if="!$root.isInstall"
        class="install-btn"
        @click="install">
        <span>{{ text.install[lang] }}</span>
        <svg class="icon">
          <use xlink:href="#install"/>
        </svg>
      </button>
      <share/>
    </div>
    <!-- <template v-if="isEmailAuthMethod">
      <button @click="isEmailAuthMethod = !isEmailAuthMethod">Выбрать другой способ</button>
      <form
        action="?"
        @submit.prevent="signInWithEmail">
        <label>
          <input
            v-model="userEmail"
            type="email"
            placeholder="Email"
            required>
        </label>
        <label>
          <input
            v-model="userPassword"
            type="password"
            placeholder="Password"
            required>
        </label>
        <button type="submit">Sign in</button>
      </form>
    </template> -->
  </div>
</template>

<script>
// import firebase from 'firebase'
import firebaseApp from '../js/firebase.js'
import firebase from 'firebase/app'
import 'firebase/auth'
import Loading from '../components/Loading.vue'
import Share from '../components/Share.vue'

export default {
  components: {
    Loading,
    Share
  },
  data () {
    return {
      // isRegistration: false,
      // isEmailAuthMethod: false,
      // userEmail: '',
      // userPassword: '',
      onLine: navigator.onLine,
      deferredPrompt: null,
      loadingUser: false,
      isLocalhost: location.port === '8080'
    }
  },
  computed: {
    isLoadUser () {
      if (this.$store.state.user && this.$store.state.userData && !this.$store.state.loadingUser) return true
      return false
    },
    isLoadData () {
      return this.$store.state.isLoadData
    },
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.page.home
    },
    isNotRegister () {
      if (!this.$store.state.loadingUser && !this.$store.state.user) return true
      if (this.$store.state.user && this.$store.state.user.id === 'guest') return true
      return false
    }
  },
  mounted: function () {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      this.$root.isInstall = false
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'game' && vm.$store.state.loadingUser) {
        let id = vm.$store.state.user.id
        let ref = firebase.database().ref(`users/${id}`)
        let userData = {}
        ref.once('value', (snap) => {
          userData[id] = snap.val()
          vm.$store.commit('SET_USER_DATA', userData)
          vm.$store.commit('SET_LOADING_USER', false)
        })
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$root.playAudio('click')
    next()
  },
  methods: {
    reset () {
      this.$root.playAudio('click')
      this.$store.commit('RESET_STATE')
      location.reload()
      // localStorage.setItem('vuex', 'asd')
    },
    signInWithGoogle () {
      this.loadingUser = true
      this.$root.playAudio('click')
      this.$store.commit('SET_LOADING_USER', true)
      this.$store.commit('RESET_USER_STATE')
      let provider = new firebase.auth.GoogleAuthProvider()
      firebaseApp.auth().signInWithRedirect(provider).then((result) => {
        let userInfo = {
          name: result.user.displayName,
          img: result.user.photoURL,
          id: result.user.uid
        }
        this.$store.commit('SET_USER', userInfo)
        this.$store.commit('SET_LOADING_USER', false)
        this.loadingUser = false
        console.log(this.$store.state)
      }).catch(() => {
        // console.log(err)
      })
    },
    signInWithFacebook () {
      this.loadingUser = true
      this.$root.playAudio('click')
      this.$store.commit('SET_LOADING_USER', true)
      this.$store.commit('RESET_USER_STATE')
      let provider = new firebase.auth.FacebookAuthProvider()
      firebaseApp.auth().signInWithPopup(provider).then((result) => {
        let userInfo = {
          name: result.user.displayName,
          img: result.user.photoURL,
          id: result.user.uid
        }
        this.$store.commit('SET_USER', userInfo)
        this.$store.commit('SET_LOADING_USER', false)
        this.loadingUser = false
      }).catch(() => {
        // console.log(err)
      })
    },
    // signInWithEmail () {
    //   this.$store.commit('SET_LOADING_USER', true)
    //   firebaseApp.auth().signInWithEmailAndPassword(this.userEmail, this.userPassword).then((result) => {
    //     console.log(result)
    //     let userInfo = {
    //       name: result.user.displayName,
    //       img: result.user.photoURL,
    //       id: result.user.uid
    //     }
    //     this.$store.commit('SET_USER', userInfo)
    //     this.$store.commit('SET_LOADING_USER', false)
    //   }).catch(err => console.log(err))
    // },
    signOut () {
      this.$root.playAudio('click')
      this.$store.commit('SET_LOADING_USER', false)
      this.loadingUser = false
      let userId = this.$store.state.user.id
      let userData = this.$store.state.userData[userId][this.lang]
      let firebaseData = {
        userId: userId,
        lang: this.lang,
        props: {
          taskLevel: userData.taskLevel,
          taskSublevel: userData.taskSublevel,
          coins: userData.coins,
          strike: userData.strike,
          common: userData.common,
          history: userData.history
        }
      }
      let firebaseDataAwards = {
        userId: userId,
        state: userData.awards
      }
      this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
      this.$store.dispatch('UPDATE_USER_AWARDS', firebaseDataAwards)
      this.$store.commit('RESET_USER_STATE')
      // console.log(this.$store.state)
      firebaseApp.auth().signOut().then(() => {
        this.$store.commit('RESET_USER_STATE')
        // this.$store.commit('RESET_STATE', null)
        // this.$store.commit('SET_USER', null)
        // this.$store.commit('SET_USER_DATA', null)
        // this.$root.user = null
        // console.log(this.$store.state)
      }).catch(() => {
        // console.log(err)
      })
    },
    install () {
      this.deferredPrompt.prompt()
      this.deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.$root.isInstall = true
          } else {
            this.$root.isInstall = false
          }
          this.deferredPrompt = null
        })
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.home{
  flex:auto;
  display:flex;
  flex-direction:column;
  .container{
    flex:auto;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }
}
.logo{
  margin-bottom:2rem;
  font-weight:700;
  text-transform:uppercase;
  font-size:1.7rem;
  margin-top:auto;
  font-variant:small-caps;
  span{
    display:flex;
    margin-right:1rem;
  }
  i{
    font-style:normal;
    animation:logo 1.2s infinite;
    will-change:transform;
    min-width:1rem;
    &:nth-child(2){
      animation:logo 1.2s .3s infinite;
    }
    &:nth-child(3){
      animation:logo 1.2s .1s infinite;
    }
    &:nth-child(4){
      animation:logo 1.2s .2s infinite;
    }
    &:nth-child(5){
      animation:logo 1.2s .4s infinite;
    }
    &:nth-child(6){
      animation:logo 1.2s -.2s infinite;
    }
    &:nth-child(7){
      animation:logo 1.2s -.1s infinite;
    }
    &:nth-child(8){
      animation:logo 1.2s -.3s infinite;
    }
    &:nth-child(9){
      animation:logo 1.2s .2s infinite;
    }
    &:nth-child(10){
      animation:logo 1.2s .1s infinite;
    }
    &:nth-child(11){
      animation:logo 1.2s .4s infinite;
    }
    &:nth-child(12){
      animation:logo 1.2s -.3s infinite;
    }
    &:nth-child(13){
      animation:logo 1.2s -.4s infinite;
    }
    &:nth-child(14){
      animation:logo 1.2s .2s infinite;
    }
  }
}
@keyframes logo{
  0%,20%,40%,80%,90%,100%{
    transform:translateY(0);
  }
  26%,
  84%{
    transform:translateY(-.1rem);
  }
  34%{
    transform:translateY(.1rem);
  }
}
.profile{
  display:flex;
  flex-direction:column;
  align-items:center;
}
.profile-cabinet{
  display:flex;
  align-items:center;
  color:inherit;
  transition:.4s;
  padding:.75rem 1.125rem;
  border:solid 1px @border;
  background:repeating-linear-gradient(-60deg,#f1f1f1,#f1f1f1 2px,#f9f9f9 2px,#f9f9f9 6px);
  border-radius:2.5rem;
  box-shadow:0 .5rem 2rem rgba(0,0,0,.2);
  img{
    width:50px;
    height:50px;
    border-radius:50%;
    flex:none;
  }
  .icon{
    width:2.8571rem;
    height:2.8571rem;
    flex:none;
  }
}
.btn{
  border:0;
  background:none;
  transition:.4s;
  display:flex;
  align-items:center;
  color:inherit;
  span{
    margin-right:0.3571rem;
  }
  .icon{
    width:1.4286rem;
    height:1.4286rem;
    flex:none;
  }
}
.btn-sign-out{
  margin-top:1.4286rem;
  padding:0.3571rem;
  .icon{
    width:1rem;
    height:1rem;
  }
}
.btn-play{
  font-weight:700;
  font-size:2.125rem;
  font-family:@f;
  margin-top:2rem;
  .icon{
    width:1.7857rem;
    height:1.7857rem;
    animation:logo 1.2s -.1s infinite;
  }
  use{
    fill:@green;
  }
  span{
    display:flex;
    margin-right:1rem;
  }
  i{
    font-style:normal;
    animation:logo 1.2s infinite;
    will-change:transform;
    &:nth-child(2){
      animation:logo 1.2s .3s infinite;
    }
    &:nth-child(3){
      animation:logo 1.2s .1s infinite;
    }
    &:nth-child(4){
      animation:logo 1.2s .2s infinite;
    }
    &:nth-child(5){
      animation:logo 1.2s .4s infinite;
    }
    &:nth-child(6){
      animation:logo 1.2s -.2s infinite;
    }
    &:nth-child(7){
      animation:logo 1.2s .3s infinite;
    }
    &:nth-child(8){
      animation:logo 1.2s .1s infinite;
    }
    &:nth-child(9){
      animation:logo 1.2s -.2s infinite;
    }
    &:nth-child(10){
      animation:logo 1.2s .2s infinite;
    }
    &:nth-child(11){
      animation:logo 1.2s -.3s infinite;
    }
    &:nth-child(12){
      animation:logo 1.2s -.1s infinite;
    }
    &:nth-child(13){
      animation:logo 1.2s .1s infinite;
    }
    &:nth-child(14){
      animation:logo 1.2s  infinite;
    }
    &:nth-child(15){
      animation:logo 1.2s .2s infinite;
    }
    &:nth-child(16){
      animation:logo 1.2s -.2s infinite;
    }
    &:nth-child(17){
      animation:logo 1.2s .4s infinite;
    }
    &:nth-child(18){
      animation:logo 1.2s .1s infinite;
    }
    &:nth-child(19){
      animation:logo 1.2s .3s infinite;
    }
    &:nth-child(20){
      animation:logo 1.2s .2s infinite;
    }
    &:nth-child(21){
      animation:logo 1.2s infinite;
    }
    &:nth-child(22){
      animation:logo 1.2s .1s infinite;
    }
  }
}
.btn-play-small{
  font-size:1.4rem;
  i{
    min-width:.5rem;
  }
}
.enter-block-title{
  width:17.8571rem;
  margin:0 auto 1rem;
  font-size:.9375rem;
  text-align:center;
}
.enter-btns{
  display:flex;
  flex-direction:column;
  align-items:center;
  li+li{
    margin-top:1.4286rem;
  }
}
.btn-sign-in{
  width:17.8571rem;
  height:3.5714rem;
  justify-content:center;
  color:#fff;
  border-radius:2rem;
  use{
    fill:#fff;
  }
}
.btn-sign-in-with-google{
  background-color:#4285f4;
  box-shadow:0 .5rem 1rem fade(#4285f4,40%);
}
.btn-sign-in-with-facebook{
  background-color:#4267b2;
  box-shadow:0 .5rem 1rem fade(#4267b2,40%);
}
.info-btns{
  margin:3.5714rem -1.4286rem 1.0714rem;
  display:flex;
  flex-wrap:wrap;
  li{
    padding:0 1.4286rem 1.0714rem;
  }
}
.btn-top,
.btn-instruction{
  .icon{
    width:1.7857rem;
    height:1.7857rem;
  }
}
.loading-icon{
  display:flex;
  justify-content:center;
  align-items:center;
  i{
    width:0.7143rem;
    height:0.7143rem;
    border-radius:50%;
    background-color:currentColor;
    &:not(:last-child){
      margin-right:0.7143rem;
    }
    &:first-child{
      animation:loading 1s infinite;
    }
    &:nth-child(2){
      animation:loading 1s .2s infinite;
    }
    &:last-child{
      animation:loading 1s .4s infinite;
    }
  }
}
.loading-icon-profile{
  height:2.8571rem;
}
.loading-icon-all{
  height:2.3571rem;
  margin-top:2.8571rem;
}
@keyframes loading{
  from,
  to{
    transform:scale(1);
    opacity:1;
  }
  50%{
    transform:scale(0);
    opacity:0;
  }
}
.install-btn{
  border:0;
  background:none;
  display:flex;
  align-items:center;
  margin-bottom:1.0714rem;
  font-weight:700;
  font-size:1.1429rem;
  padding:0.3571rem;
  span{
    margin-right:0.3571rem;
  }
  .icon{
    width:2.1429rem;
    height:2.1429rem;
    use{
      fill:@red;
    }
    animation:install-btn 4s infinite;
  }
}
@keyframes install-btn{
  0%, 20%, 60%{
    transform:translateY(0);
  }
  45%{
    transform:translateY(-1rem);
  }
  55%{
    transform:translateY(1rem);
  }
}
.profile-cabinet-user{
  margin:0 .75rem;
}
.profile-cabinet-user-name{
  display:block;
  margin-bottom:.3125rem;
}
.profile-cabinet-user-info{
  display:flex;
  align-items:center;
  font-size:.875rem;
}
.profile-cabinet-user-info-block{
  display:flex;
  align-items:center;
  color:@placeholder;
  &:not(:last-child){
    margin-right:.75rem;
  }
  .icon{
    width:1rem;
    height:1rem;
    margin-right:.3175rem;
    use{
      fill:currentColor;
    }
  }
}
</style>
