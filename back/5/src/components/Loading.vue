<template>
  <div
    v-if="loading"
    class="loading">
    <div class="loading-icon">
      <i/><i/><i/>
    </div>
    <div class="loading-title">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.loading{
  position:fixed;
  left:0;
  right:0;
  top:0;
  bottom:0;
  z-index:666666666;
  background-color:rgba(255,255,255,.95);
  text-align:center;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
}
.loading-title{
  font-weight:700;
}
.loading-icon{
  width:2.1429rem;
  height:1.75rem;
  margin-bottom:1.4286rem;
  position:relative;
  i{
    position:absolute;
    width:0.4286rem;
    top:0;
    bottom:0;
    background-color:currentColor;
    &:first-child{
      left:0;
      animation:loading 1s infinite;
    }
    &:nth-child(2){
      left:50%;
      margin-left:-0.2143rem;
      animation:loading 1s .2s infinite;
    }
    &:last-child{
      right:0;
      animation:loading 1s .4s infinite;
    }
  }
}
@keyframes loading{
  from,
  to{
    transform:scaleY(1)
  }
  50%{
    transform:scaleY(.2)
  }
}
</style>
