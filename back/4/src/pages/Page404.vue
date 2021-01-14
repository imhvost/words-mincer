<template>
  <div class="page-content home">
    <div class="container">
      <p>404 Error</p>
      <br>
      <p>
        <router-link
          :to="'/'"
          class="profile-cabinet"
          exact
          tag="a"
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

</style>
