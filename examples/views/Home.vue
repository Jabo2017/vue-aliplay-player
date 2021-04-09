<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" />

		<vueAliplayer ref="player"  :speedAble="false"/>
		
		<button @click="setFull">全屏信息</button>
    <button @click="changeFlv">flv</button>
    <button @click="changeHLS">HLS</button>
		<button @click="changeHLS2">HLS2</button>
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
      this.$refs.player.loadPlayer('http://192.168.110.22:8080/cyberplayer-demo.flv')
    },
    changeHLS(){
      this.$refs.player.loadPlayer('http://hls01open.ys7.com/openlive/847a2635381e4fc4b17a0f005711fd7f.m3u8')
    },
		changeHLS2(){
			this.$refs.player.loadPlayer('http://27.156.4.244:44505/pss/system/hls/520-20210409_140943/520-20210409_140943.m3u8')
		}
	}
};
</script>
