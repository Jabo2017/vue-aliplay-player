import vueAliplayer from './src/player.vue'

 /**
  * 预览做全局组件使用，按需加载组件可以不需要这个install
  */
vueAliplayer.install = function(vue) { 
	Vue.component(vueAliplayer.name, vueAliplayer)
}
export default vueAliplayer