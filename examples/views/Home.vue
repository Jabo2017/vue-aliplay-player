<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" />

		<vueAliplayer ref="player" />
		
		<button @click="setFull">全屏信息</button>
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
			this.$refs.player.loadPlayer('rtsp://36.250.11.97/live/0');
		},
		setFull(){
			this.$refs.player.setFull();
		}
	}
};
</script>
