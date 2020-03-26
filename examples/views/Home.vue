<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
	
	<vueAliplayer />
  </div>
</template>

<script>
import  vueAliplayer  from './../../lib/vue-aliplay-player.umd.js'
export default {
  name: 'Home',
  components: {
    vueAliplayer: vueAliplayer
  }
}
</script>
