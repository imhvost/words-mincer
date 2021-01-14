<template>
  <div class="page">
    <div class="container">
      <transition
        name="fade"
        mode="out-in"
        appear
      >
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
@import (less) './less/variables.less';

</style>
