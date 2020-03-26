import vueAliplayer from './src/player.vue'
vueAliplayer.install = function(vue) {
	Vue.component(vueAliplayer.name, vueAliplayer)
}
export default vueAliplayer