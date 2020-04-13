<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" />

		<vueAliplayer ref="player" />
	</div>
</template>

<script>
import vueAliplayer from './../../lib/vue-aliplay-player.umd.js';
import './../../lib/vue-aliplay-player.css';
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
			this.$refs.player.loadPlayer('{"HD":"http://common.qupai.me/player/qupai.mp4","SD":"http://common.qupai.me/player/qupai.mp4"}');
		}
	}
};
</script>
