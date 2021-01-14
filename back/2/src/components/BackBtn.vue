<template>
  <button
    type="button"
    class="btn"
    @click="back()">
    <svg class="icon">
      <use xlink:href="#back"/>
    </svg>
    <span>{{ text.btn[lang] }}</span>
  </button>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    lang () {
      return this.$store.state.settings.lang
    },
    text () {
      return this.$store.state.text.components.backBtn
    }
  },
  methods: {
    back () {
      this.$root.playAudio('click')
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.btn{
  margin:-2.1429rem 0 1.4286rem;
  display:flex;
  align-items:center;
  border:0;
  background:none;
  .icon{
    width:1.7857rem;
    height:1.7857rem;
    margin-right:0.7143rem;
  }
}
</style>
