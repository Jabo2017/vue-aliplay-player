<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" />

		<vueAliplayer ref="player"  :speedAble="false"/>
		
		<button @click="setFull">全屏信息</button>
    <button @click="changeFlv">flv</button>
    <button @click="changeHLS">HLS</button>
	</div>
</template>

<script>
// import vueAliplayer from './../../lib/vue-aliplay-player.umd.js';
// import './../../lib/vue-aliplay-player.css';

import vueAliplayer from './../../packages/vue-aliplay-player/src/player.vue'

export default {
	name: 'Home',
	components: {
		vueAliplayer: vueAliplayer
	},
	mounted() {
		this.$nextTick(() => {
			this.player();
		});
	},
	methods: {
		player() {
			this.$refs.player.loadPlayer('http://hls01open.ys7.com/openlive/847a2635381e4fc4b17a0f005711fd7f.m3u8');
      // this.$refs.player.loadPlayer('http://localhost:8080/cyberplayer-demo.flv');
		},
		setFull(){
			this.$refs.player.setFull();
		},
    changeFlv(){
      this.$refs.player.loadPlayer('http://localhost:8080/cyberplayer-demo.flv')
    },
    changeHLS(){
      this.$refs.player.loadPlayer('http://hls01open.ys7.com/openlive/847a2635381e4fc4b17a0f005711fd7f.m3u8')
    }
	}
};
</script>
