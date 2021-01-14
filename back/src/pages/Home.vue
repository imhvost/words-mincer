<template>
  <div class="page-content">
    <button @click="test">test</button>
    <div v-if="$root.loadingData">Загрузка данных...</div>
    <router-link
      v-if="!$root.loadingData"
      exact
      tag="a"
      to="/game">
      Играть
    </router-link>
    <div v-if="$root.loadingUser">Загрузка пользователя...</div>
    <template v-if="$root.user">
      <img
        :src="$root.user.photoURL"
        alt="avatar"
        style="width: 30px; height: 30px; border-radius: 50%;">
      <button @click="signOut">Sign Out</button>
    </template>
    <template v-if="!$root.user && !$root.loadingUser">
      <button @click="signInWithGoogle">Sign in with Google</button>
    </template>
  </div>
</template>

<script>
import firebase from 'firebase'
import firebaseApp from '../js/firebase.js'

export default {
  components: {},
  data () {
    return {}
  },
  methods: {
    test () {
      // console.log(this.$root.config)
    },
    signInWithGoogle () {
      let provider = new firebase.auth.GoogleAuthProvider()
      firebaseApp.auth().signInWithRedirect(provider).then((result) => {
        this.$root.user = result.user
      }).catch(err => console.log(err))
    },
    signOut () {
      firebaseApp.auth().signOut().then(() => {
        this.$root.user = null
      }).catch(err => console.log(err))
    }
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
</style>
