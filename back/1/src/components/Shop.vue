<template>
  <div>
    <ul class="shop-list">
      <li>
        <button
          type="button"
          @click="buyHelper('openFirstLetters')">Купить Открывашку (ст.{{ getBuyCost('openFirstLetters') }})</button>
      </li>
      <li>
        <button
          type="button"
          @click="buyHelper('openLastLetters')">Купить Штопор (ст.{{ getBuyCost('openLastLetters') }})</button>
      </li>
      <li>
        <button
          type="button"
          @click="buyHelper('bomb')">Купить Бомбу (ст.{{ getBuyCost('bomb') }})</button>
      </li>
    </ul>
    <ul class="shop-list">
      <li>
        <button
          :class="getCostNextLevel('openFirstLetters') ? '' : 'disabled'"
          class="shop-btn"
          type="button"
          @click="levelUpHelper('openFirstLetters')">
          levelUp openFirstLetters
          (тек.ур.{{ getLevel('openFirstLetters') }})
          <template v-if="getCostNextLevel('openFirstLetters')">
            (ст.{{ getCostNextLevel('openFirstLetters') }})
          </template>
        </button>
      </li>
      <li>
        <button
          :class="getCostNextLevel('openLastLetters') ? '' : 'disabled'"
          class="shop-btn"
          type="button"
          @click="levelUpHelper('openLastLetters')">
          levelUp openLastLetters
          (тек.ур.{{ getLevel('openLastLetters') }})
          <template v-if="getCostNextLevel('openLastLetters')">
            (ст.{{ getCostNextLevel('openLastLetters') }})
          </template>
        </button>
      </li>
      <li>
        <button
          :class="getCostNextLevel('bomb') ? '' : 'disabled'"
          class="shop-btn"
          type="button"
          @click="levelUpHelper('bomb')">
          levelUp bomb
          (тек.ур.{{ getLevel('bomb') }})
          <template v-if="getCostNextLevel('bomb')">
            (ст.{{ getCostNextLevel('bomb') }})
          </template>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  props: {
    //
  },
  data () {
    return {
      desc: [],
      add: []
    }
  },
  computed: {
    ...mapState(['config', 'user', 'settings']),
    userData () {
      return this.$store.state.userData[this.user.id][this.settings.lang]
    },
    firebaseData () {
      return {
        userId: this.user.id,
        lang: this.settings.lang
      }
    }
  },
  methods: {
    getBuyCost (helper) {
      return this.config.helpers[helper].cost
    },
    getLevel (helper) {
      return this.userData.helpers[helper].level
    },
    getCostNextLevel (helper) {
      let helperLevel = this.userData.helpers[helper].level
      let levels = this.config.helpers[helper].levels
      if (levels[helperLevel + 1]) {
        return levels[helperLevel + 1].cost
      }
      return false
    },
    buyHelper (helper) {
      let cost = this.config.helpers[helper].cost
      if (cost > this.userData.coins) {
        this.alertNoCoins()
        return
      }
      this.playAudio('./static/audio/buy.mp3')
      this.addCoins(-cost)
      this.userData.helpers[helper].count++
      let firebaseData = this.firebaseData
      firebaseData.props = {
        ['helpers/' + helper + '/count']: this.userData.helpers[helper].count
      }
      this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
    },
    levelUpHelper (helper) {
      let cost = this.getCostNextLevel(helper)
      if (!cost) return
      if (cost > this.userData.coins) {
        this.alertNoCoins()
        return
      }
      this.playAudio('./static/audio/levelUp.mp3')
      this.addCoins(-cost)
      this.userData.helpers[helper].level++
      let firebaseData = this.firebaseData
      firebaseData.props = {
        ['helpers/' + helper + '/level']: this.userData.helpers[helper].level
      }
      this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
    },
    alertNoCoins () {
      alert('Не хватает монет!')
    },
    addCoins (coins) {
      this.userData.coins += coins
      this.userData.common.coins += coins
      let firebaseData = this.firebaseData
      firebaseData.props = {
        coins: this.userData.coins
      }
      this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
    },
    playAudio (src) {
      if (this.settings.audio !== 'on') return
      let audio = new Audio(src)
      audio.play()
    }
  }
}
</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';

</style>
