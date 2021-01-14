<template>
  <div class="page">
    <div
      class="icons"
      v-html="icons"/>
    <transition
      name="fade"
      mode="out-in"
      appear
    >
      <router-view/>
    </transition>
  </div>
</template>

<script>
import Icons from './static/img/sprite.svg'

export default {
  data () {
    return {
      icons: Icons
    }
  }
}
</script>

<style lang="less">
@import (less) './less/variables.less';
.icons{
  display:none;
  path,
  g:not([fill="none"]){
    fill:inherit;
  }
}

</style>
