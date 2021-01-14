<template>
  <div class="page-content">
    <button @click="test">test</button>
    <span v-if="!$store.state.isLoadData">Загрузка данных...</span>
    <router-link
      v-if="$store.state.isLoadData && $store.state.user && $store.state.userData"
      exact
      tag="a"
      to="/game">
      Играть
    </router-link>
    <span v-if="$store.state.loadingUser">Загрузка пользователя...</span>
    <template v-if="$store.state.user">
      <img
        :src="$store.state.user.img"
        alt="avatar"
        style="width: 30px; height: 30px; border-radius: 50%;">
      <span>{{ $store.state.user.name }}</span>
      <button @click="signOut">Sign Out</button>
    </template>
    <template v-if="!$store.state.user && !$store.state.loadingUser && !isEmailAuthMethod">
      <button @click="signInWithGoogle">Sign in with Google</button>
      <button @click="signInWithFacebook">Sign in with Facebook</button>
      <!-- <button @click="isEmailAuthMethod = !isEmailAuthMethod">Sign in with Email</button> -->
    </template>
    <router-link
      v-if="$store.state.isLoadData && $store.state.user && $store.state.userData"
      :to="`/user/${$store.state.user.id}/${$store.state.settings.lang}`"
      exact
      tag="a">
      Профиль
    </router-link>
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
import firebase from 'firebase'
import firebaseApp from '../js/firebase.js'

export default {
  components: {},
  data () {
    return {
      isRegistration: false,
      isEmailAuthMethod: false,
      userEmail: '',
      userPassword: ''
    }
  },
  mounted: function () {
    // let ref = firebase.database().ref('users')
    // let lang = this.$store.state.settings.lang
    // ref.orderByChild(`${lang}/common/coins/`).limitToLast(10).on('child_added', function (data) {
    //   console.log(data)
    // })
  },
  methods: {
    test () {
      this.$store.commit('RESET_STATE')
      // localStorage.setItem('vuex', 'asd')
    },
    signInWithGoogle () {
      this.$store.commit('SET_LOADING_USER', true)
      let provider = new firebase.auth.GoogleAuthProvider()
      firebaseApp.auth().signInWithRedirect(provider).then((result) => {
        let userInfo = {
          name: result.user.displayName,
          img: result.user.photoURL,
          id: result.user.uid
        }
        this.$store.commit('SET_USER', userInfo)
        this.$store.commit('SET_LOADING_USER', false)
      }).catch(err => console.log(err))
    },
    signInWithFacebook () {
      this.$store.commit('SET_LOADING_USER', true)
      let provider = new firebase.auth.FacebookAuthProvider()
      firebaseApp.auth().signInWithPopup(provider).then((result) => {
        let userInfo = {
          name: result.user.displayName,
          img: result.user.photoURL,
          id: result.user.uid
        }
        this.$store.commit('SET_USER', userInfo)
        this.$store.commit('SET_LOADING_USER', false)
      }).catch(err => console.log(err))
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
      firebaseApp.auth().signOut().then(() => {
        this.$store.commit('SET_USER', null)
        this.$store.commit('SET_USER_DATA', null)
        // this.$root.user = null
      }).catch(err => console.log(err))
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
</style>
