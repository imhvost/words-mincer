<template>
  <div>
    <div class="shop-section">
      <div class="shop-count">
        <div>У вас</div>
        <div class="shop-count-icon">
          <svg class="icon">
            <use xlink:href="#coins"/>
          </svg>
          <span>{{ userData.coins }}</span>
        </div>
        <div>
          {{ declOfNum(userData.coins, [text.coinsCount[0][lang], text.coinsCount[1][lang], text.coinsCount[2][lang]]) }}
        </div>
      </div>
    </div>
    <div class="shop-section">
      <div class="shop-title">{{ text.titleBuy[lang] }}</div>
      <ul class="shop-list">
        <li>
          <button
            type="button"
            class="shop-btn"
            @click="buyHelper('openFirstLetters', $event)">
            <svg class="icon">
              <use xlink:href="#openFirstLetters"/>
            </svg>
            <span class="shop-btn-desc">
              <b class="shop-btn-name">{{ text.helpersNames.openFirstLetters[lang] }}</b>
              <span class="shop-btn-cost">
                <svg class="icon">
                  <use xlink:href="#coins"/>
                </svg>
                {{ getBuyCost('openFirstLetters') }}
              </span>
            </span>
          </button>
          <div class="shop-list-alert">{{ text.noCoins[lang] }}</div>
        </li>
        <li>
          <button
            type="button"
            class="shop-btn"
            @click="buyHelper('openLastLetters', $event)">
            <svg class="icon">
              <use xlink:href="#openLastLetters"/>
            </svg>
            <span class="shop-btn-desc">
              <b class="shop-btn-name">{{ text.helpersNames.openLastLetters[lang] }}</b>
              <span class="shop-btn-cost">
                <svg class="icon">
                  <use xlink:href="#coins"/>
                </svg>
                {{ getBuyCost('openLastLetters') }}
              </span>
            </span>
          </button>
          <div class="shop-list-alert">{{ text.noCoins[lang] }}</div>
        </li>
        <li>
          <button
            type="button"
            class="shop-btn"
            @click="buyHelper('bomb', $event)">
            <svg class="icon">
              <use xlink:href="#bomb"/>
            </svg>
            <span class="shop-btn-desc">
              <b class="shop-btn-name">{{ text.helpersNames.bomb[lang] }}</b>
              <span class="shop-btn-cost">
                <svg class="icon">
                  <use xlink:href="#coins"/>
                </svg>
                {{ getBuyCost('bomb') }}
              </span>
            </span>
          </button>
          <div class="shop-list-alert">{{ text.noCoins[lang] }}</div>
        </li>
      </ul>
    </div>
    <div class="shop-section">
      <div class="shop-title">{{ text.titleLevelUp[lang] }}</div>
      <ul class="shop-list">
        <li>
          <button
            :class="getHelperNextLevel('openFirstLetters') ? '' : 'disabled'"
            type="button"
            class="shop-btn shop-btn-level-up"
            @click="levelUpHelper('openFirstLetters', $event)">
            <svg class="icon">
              <use xlink:href="#openFirstLetters"/>
            </svg>
            <span class="shop-btn-desc">
              <b class="shop-btn-name">{{ text.helpersNames.openFirstLetters[lang] }}</b>
              <span class="shop-btn-cost">
                <template v-if="getHelperNextLevel('openFirstLetters')">
                  <svg class="icon">
                    <use xlink:href="#coins"/>
                  </svg>
                  {{ getHelperNextLevel('openFirstLetters').cost }}
                </template>
                <template v-else>MAX</template>
              </span>
            </span>
          </button>
          <div class="shop-level-info">
            <div class="shop-level-info-block">
              <div class="shop-level-info-title"><span>{{ text.levelUp.titles.currentLevel[lang] }}</span> <b>{{ getLevel('openFirstLetters') }}</b></div>
              <div class="shop-level-info-desc">
                {{ text.levelUp.titles.open[lang] }}
                <b>
                  {{ getHelperLevel('openFirstLetters').letters }}
                </b>
                {{ declOfNum(getHelperLevel('openFirstLetters').letters, [text.levelUp.desc.openFirstLetters.letter[0][lang], text.levelUp.desc.openFirstLetters.letter[1][lang], text.levelUp.desc.openFirstLetters.letter[2][lang]]) }}
                {{ text.levelUp.titles.in[lang] }}
                <b>
                  {{ getHelperLevel('openFirstLetters').words }}
                </b>
                {{ getHelperLevel('openFirstLetters').words === 1 ? text.levelUp.desc.openFirstLetters.word[0][lang] : text.levelUp.desc.openFirstLetters.word[1][lang] }}
              </div>
              <div
                v-if="getHelperNextLevel('openFirstLetters')"
                class="shop-level-up-next-info">
                <div class="shop-level-info-title">{{ text.levelUp.titles.nextLevel[lang] }}</div>
                <div class="shop-level-info-desc">
                  {{ text.levelUp.titles.open[lang] }}
                  <b>
                    {{ getHelperNextLevel('openFirstLetters').letters }}
                  </b>
                  {{ declOfNum(getHelperNextLevel('openFirstLetters').letters, [text.levelUp.desc.openFirstLetters.letter[0][lang], text.levelUp.desc.openFirstLetters.letter[1][lang], text.levelUp.desc.openFirstLetters.letter[2][lang]]) }}
                  {{ text.levelUp.titles.in[lang] }}
                  <b>
                    {{ getHelperNextLevel('openFirstLetters').words }}
                  </b>
                  {{ getHelperNextLevel('openFirstLetters').words === 1 ? text.levelUp.desc.openFirstLetters.word[0][lang] : text.levelUp.desc.openFirstLetters.word[1][lang] }}
                </div>
              </div>
              <div
                v-else
                class="shop-level-info-max">
                {{ text.levelUp.titles.max[lang] }}
              </div>
            </div>
          </div>
          <div class="shop-list-alert">{{ text.noCoins[lang] }}</div>
        </li>
        <li>
          <button
            :class="getHelperNextLevel('openLastLetters') ? '' : 'disabled'"
            type="button"
            class="shop-btn shop-btn-level-up"
            @click="levelUpHelper('openLastLetters', $event)">
            <svg class="icon">
              <use xlink:href="#openLastLetters"/>
            </svg>
            <span class="shop-btn-desc">
              <b class="shop-btn-name">{{ text.helpersNames.openLastLetters[lang] }}</b>
              <span class="shop-btn-cost">
                <template v-if="getHelperNextLevel('openLastLetters')">
                  <svg class="icon">
                    <use xlink:href="#coins"/>
                  </svg>
                  {{ getHelperNextLevel('openLastLetters').cost }}
                </template>
                <template v-else>MAX</template>
              </span>
            </span>
          </button>
          <div class="shop-level-info">
            <div class="shop-level-info-block">
              <div class="shop-level-info-title"><span>{{ text.levelUp.titles.currentLevel[lang] }}</span> <b>{{ getLevel('openLastLetters') }}</b></div>
              <div class="shop-level-info-desc">
                {{ text.levelUp.titles.open[lang] }}
                <b>
                  {{ getHelperLevel('openLastLetters').letters }}
                </b>
                {{ declOfNum(getHelperLevel('openLastLetters').letters, [text.levelUp.desc.openLastLetters.letter[0][lang], text.levelUp.desc.openLastLetters.letter[1][lang], text.levelUp.desc.openLastLetters.letter[2][lang]]) }}
                {{ text.levelUp.titles.in[lang] }}
                <b>
                  {{ getHelperLevel('openLastLetters').words }}
                </b>
                {{ getHelperLevel('openLastLetters').words === 1 ? text.levelUp.desc.openLastLetters.word[0][lang] : text.levelUp.desc.openLastLetters.word[1][lang] }}
              </div>
              <div
                v-if="getHelperNextLevel('openLastLetters')"
                class="shop-level-up-next-info">
                <div class="shop-level-info-title">{{ text.levelUp.titles.nextLevel[lang] }}</div>
                <div class="shop-level-info-desc">
                  {{ text.levelUp.titles.open[lang] }}
                  <b>
                    {{ getHelperNextLevel('openLastLetters').letters }}
                  </b>
                  {{ declOfNum(getHelperNextLevel('openLastLetters').letters, [text.levelUp.desc.openLastLetters.letter[0][lang], text.levelUp.desc.openLastLetters.letter[1][lang], text.levelUp.desc.openLastLetters.letter[2][lang]]) }}
                  {{ text.levelUp.titles.in[lang] }}
                  <b>
                    {{ getHelperNextLevel('openLastLetters').words }}
                  </b>
                  {{ getHelperNextLevel('openLastLetters').words === 1 ? text.levelUp.desc.openLastLetters.word[0][lang] : text.levelUp.desc.openLastLetters.word[1][lang] }}
                </div>
              </div>
              <div
                v-else
                class="shop-level-info-max">
                {{ text.levelUp.titles.max[lang] }}
              </div>
            </div>
          </div>
          <div class="shop-list-alert">{{ text.noCoins[lang] }}</div>
        </li>
        <li>
          <button
            :class="getHelperNextLevel('bomb') ? '' : 'disabled'"
            type="button"
            class="shop-btn shop-btn-level-up"
            @click="levelUpHelper('bomb', $event)">
            <svg class="icon">
              <use xlink:href="#bomb"/>
            </svg>
            <span class="shop-btn-desc">
              <b class="shop-btn-name">{{ text.helpersNames.bomb[lang] }}</b>
              <span class="shop-btn-cost">
                <template v-if="getHelperNextLevel('bomb')">
                  <svg class="icon">
                    <use xlink:href="#coins"/>
                  </svg>
                  {{ getHelperNextLevel('bomb').cost }}
                </template>
                <template v-else>MAX</template>
              </span>
            </span>
          </button>
          <div class="shop-level-info">
            <div class="shop-level-info-block">
              <div class="shop-level-info-title"><span>{{ text.levelUp.titles.currentLevel[lang] }}</span> <b>{{ getLevel('bomb') }}</b></div>
              <div class="shop-level-info-desc">
                {{ text.levelUp.titles.open[lang] }} {{ text.levelUp.desc.bomb.word[lang] }}
                <b>
                  {{ getHelperLevel('bomb').letters }}
                </b>
                {{ declOfNum(getHelperLevel('bomb').letters, [text.levelUp.desc.bomb.letter[0][lang], text.levelUp.desc.bomb.letter[1][lang], text.levelUp.desc.bomb.letter[2][lang]]) }}
              </div>
              <div
                v-if="getHelperNextLevel('bomb')"
                class="shop-level-up-next-info">
                <div class="shop-level-info-title">{{ text.levelUp.titles.nextLevel[lang] }}</div>
                <div class="shop-level-info-desc">
                  {{ text.levelUp.titles.open[lang] }} {{ text.levelUp.desc.bomb.word[lang] }}
                  <b>
                    {{ getHelperNextLevel('bomb').letters }}
                  </b>
                  {{ declOfNum(getHelperNextLevel('bomb').letters, [text.levelUp.desc.bomb.letter[0][lang], text.levelUp.desc.bomb.letter[1][lang], text.levelUp.desc.bomb.letter[2][lang]]) }}
                </div>
              </div>
              <div
                v-else
                class="shop-level-info-max">
                {{ text.levelUp.titles.max[lang] }}
              </div>
            </div>
          </div>
          <div class="shop-list-alert">{{ text.noCoins[lang] }}</div>
        </li>
      </ul>
    </div>
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
      add: [],
      modalAwards: []
      // awardIsOpen: false
    }
  },
  computed: {
    ...mapState(['config', 'user', 'settings']),
    userData () {
      return this.$store.state.userData[this.user.id][this.settings.lang]
    },
    awards () {
      return this.$store.state.userData[this.user.id].awards
    },
    firebaseData () {
      return {
        userId: this.user.id,
        lang: this.settings.lang
      }
    },
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.components.shop
    }
  },
  methods: {
    getBuyCost (helper) {
      return this.config.helpers[helper].cost
    },
    getLevel (helper) {
      return this.userData.helpers[helper].level
    },
    getHelperLevels (helper) {
      return this.config.helpers[helper].levels
    },
    getHelperLevel (helper) {
      let helperLevel = this.getLevel(helper)
      let levels = this.getHelperLevels(helper)
      return levels[helperLevel]
    },
    getHelperNextLevel (helper) {
      let helperLevel = this.getLevel(helper)
      let levels = this.getHelperLevels(helper)
      if (levels[helperLevel + 1]) {
        return levels[helperLevel + 1]
      }
      return false
    },
    buyHelper (helper, event) {
      let cost = this.config.helpers[helper].cost
      if (cost > this.userData.coins) {
        this.alertNoCoins(event.target)
        return
      }
      this.$root.playAudio('buy')
      let isBuyer = true
      Object.keys(this.userData.helpers).forEach(el => {
        if (this.userData.helpers[el].count < 20) isBuyer = false
      })
      if (isBuyer) this.$emit('add-award', 'buyer')
      this.addCoins(-cost)
      this.userData.helpers[helper].count++
      let firebaseData = this.firebaseData
      firebaseData.props = {
        ['helpers/' + helper + '/count']: this.userData.helpers[helper].count
      }
      this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
    },
    levelUpHelper (helper, event) {
      let cost = this.getHelperNextLevel(helper).cost
      if (!cost) return
      if (cost > this.userData.coins) {
        this.alertNoCoins(event.target)
        return
      }
      this.$root.playAudio('levelUp')
      this.addCoins(-cost)
      this.userData.helpers[helper].level++
      let isAllMax = true
      Object.keys(this.userData.helpers).forEach(el => {
        if (this.getHelperNextLevel(el)) isAllMax = false
      })
      if (isAllMax) this.$emit('add-award', 'muscled')
      let firebaseData = this.firebaseData
      firebaseData.props = {
        ['helpers/' + helper + '/level']: this.userData.helpers[helper].level
      }
      this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
    },
    alertNoCoins (element) {
      let alert = element.closest('li').querySelector('.shop-list-alert')
      alert.classList.add('active')
      setTimeout(() => {
        alert.classList.remove('active')
      }, 1000)
    },
    addCoins (coins) {
      this.awards.state.spend += Math.abs(coins)
      let firebaseDataAwards = {
        userId: this.user.id,
        state: {
          props: {
            spend: this.awards.state.spend
          }
        }
      }
      if (this.awards.received.indexOf('spender') === -1) {
        this.$store.dispatch('UPDATE_USER_AWARDS', firebaseDataAwards)
      }
      if (this.awards.state.spend >= 4000) this.$emit('add-award', 'spender')
      this.userData.coins += coins
      let firebaseData = this.firebaseData
      firebaseData.props = {
        coins: this.userData.coins
      }
      this.$store.dispatch('UPDATE_USER_DATA', firebaseData)
    },
    declOfNum (number, titles) {
      var cases = [2, 0, 1, 1, 1, 2]
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
    }
  }
}
</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.shop-section{
  &:not(:last-child){
    padding-bottom:2.1429rem;
    margin-bottom:2.1429rem;
    border-bottom:solid 0.0714rem #ccc;
  }
}
.shop-title{
  font-weight:700;
  margin-bottom:2.1429rem;
  text-align:center;
  font-size:1.1429rem;
  font-family:@f;
  text-transform:uppercase;
}
.shop-list{
  display:flex;
  flex-wrap:wrap;
  margin:0 -0.3571rem -1.0714rem;
  justify-content:center;
  li{
    padding:0 0.3571rem 1.7857rem;
    width:18.9286rem;
    position:relative;
  }
}
.shop-btn{
  border:0;
  padding:0.7143rem;
  border:solid 0.0714rem #ccc;
  background-color:#fff;
  border-radius:~'6% 8% 6% 8% / 46% 39% 61% 54%';
  width:100%;
  text-align:center;
  transition:.4s;
  position:relative;
  padding-right:3rem;
  white-space:nowrap;
  &:before,
  &:after{
    width:1.25rem;
    height:2px;
    position:absolute;
    content:'';
    background-color:@green;
    right:1rem;
    top:50%;
    margin-top:-1px;
  }
  &:after{
    transform:rotate(90deg);
  }
  &:active{
    background-color:#eee;
  }
  &.disabled{
    opacity:.5;
    pointer-events:none;
    background-color:#eee;
    user-select:none;
  }
  &>.icon{
    width:2.8571rem;
    height:2.8571rem;
    vertical-align:middle;
    margin-right:0.7143rem;
  }
}
.shop-btn-level-up{
  &:before{
    transform:translateY(-21%) rotate(45deg);
    height:1rem;
    width:1rem;
    background:none;
    border-top:solid 2px @green;
    border-left:solid 2px @green;
  }
  &:after{
    display:none;
  }
}
.shop-btn-desc{
  display:inline-flex;
  align-items:center;
  text-align:left;
  b{
    min-width:6.4286rem;
    margin-right:0.7143rem;
  }
}
.shop-btn-cost{
  display:inline-flex;
  align-items:center;
  font-weight:700;
  .icon{
    width:1.2857rem;
    height:1.2857rem;
    flex:none;
  }
}
.shop-level-info-block{
  margin-top:0.7143rem;
}
.shop-level-info-title{
  font-weight:700;
  b{
    display:inline-flex;
    flex-direction:column;
    justify-content:center;
    width:1.4286rem;
    height:1.4286rem;
    background-color:@green;
    border-radius:50%;
    text-align:center;
    line-height:1;
    color:#fff;
  }
}
.shop-level-info-desc{
  margin-bottom:0.3571rem;
}
.shop-count{
  display:flex;
  justify-content:center;
  align-items:center;
  margin:0 -0.3571rem;
  &>div{
    padding:0 0.3571rem;
  }
}
.shop-count-icon{
  display:flex;
  align-items:center;
  font-weight:700;
  .icon{
    width:1.8571rem;
    height:1.8571rem;
    margin-right:0.3571rem;
  }
}
.shop-level-info{
  padding:0 0.3571rem;
}
.shop-list-alert{
  position:absolute;
  width:12.1429rem;
  padding:1.4286rem;
  background-color:#fff;
  box-shadow:0 0.7143rem 1.4286rem rgba(0,0,0,.2), 0 -0.7143rem 1.4286rem rgba(0,0,0,.1);
  will-change:transform, opacity, visibility;
  opacity:0;
  visibility:hidden;
  bottom:100%;
  transform:translateY(-1.4286rem);
  left:50%;
  margin:0 0 0.7143rem -6.0714rem;
  color:@red;
  text-align:center;
  transition:.4s;
  font-weight:700;
  &.active{
    opacity:1;
    visibility:visible;
    transform:translateY(0);
  }
  &:after{
    content:'';
    position:absolute;
    top:100%;
    left:50%;
    border-left:solid 0.8571rem transparent;
    border-right:solid 0.8571rem transparent;
    border-top:solid 0.7143rem #fff;
    margin-left:-0.8571rem;
  }
}
.shop-level-info-max{
  color:@green;
}
.shop-awards-close{
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
.shop-awards{
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  z-index:66;
  background-color:rgba(33,33,33,.7);
  display:flex;
  flex-direction:column;
  justify-content:center;
  padding:1.0714rem;
  transition:.4s;
  opacity:0;
  visibility:hidden;
  &.active{
    opacity:1;
    visibility:visible;
  }
}
.shop-awards-body{
  position:relative;
  padding:2.8571rem 1.0714rem;
  background-color:#fff;
}
.shop-awards-title{
  font-size:1.7143rem;
  text-transform:uppercase;
  margin-bottom:1.4286rem;
}
.awards{
  margin:0 -0.7143rem -2.1429rem;
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
}
.award{
  width:50%;
  padding:0 0.7143rem 2.1429rem;
  text-align:center;
  &.active{
    .icon,
    .award-title{
      opacity:1;
    }
  }
  @media @sm{
    width:100%;
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
.shop-level-up-next-info{
  font-style:italic;
  padding:.375rem;
  position:relative;
  border:solid 1px #ccc;
  .shop-level-info-desc{
    margin-bottom:0;
  }
}
</style>
