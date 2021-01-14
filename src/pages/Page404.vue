<template>
  <div class="page-content home">
    <div class="container">
      <p>404 Error</p>
      <br>
      <p>
        <router-link
          :to="'/'"
          class="btn"
          exact
          tag="button"
          @click.native="$root.playAudio('click')">
          Back to Home
        </router-link>
      </p>
    </div>
  </div>
</template>
<script>

</script>
<style lang="less" scoped>
@import (less) '../less/variables.less';
.btn{
  color:@link;
}
</style>
