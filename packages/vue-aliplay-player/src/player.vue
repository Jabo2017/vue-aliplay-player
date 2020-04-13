<template>
	<div class="prism-player" :id="playerId" :style="playStyle"></div>
</template>

<script>
export default {
	name: 'vue-aliplay-player',
	props: {
		playStyle: {
			type: String,
			default: ''
		},
		aliplayerSdkPath: {
			type: String,
			default: 'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js'
		},
		autoplay: {
			type: Boolean,
			default: true
		},
		isLive: {
			type: Boolean,
			default: true
		},
		playsinline: {
			// H5是否内置播放，有的Android浏览器不起作用。
			type: Boolean,
			default: true
		},
		width: {
			type: String,
			default: '100%'
		},
		height: {
			type: String,
			default: '320px'
		},
		controlBarVisibility: {
			// 控制面板的实现，默认为‘hover’， 可选的值为：‘click’、‘hover’、‘always’。
			type: String,
			default: 'hover'
		},
		useH5Prism: {
			type: Boolean,
			default: false
		},
		useFlashPrism: {
			type: Boolean,
			default: false
		},
		vid: {
			type: String,
			default: ''
		},
		playauth: {
			type: String,
			default: ''
		},
		source: {
			type: String,
			default: ''
		},
		cover: {
			type: String,
			default: ''
		},
		format: {
			type: String,
			default: 'm3u8'
		},
		skinLayout: {
			type: Array,
			default: function() {
				return [];
			}
		},
		x5_video_position: {
			type: String,
			default: 'top'
		},
		x5_type: {
			type: String,
			default: 'h5'
		},
		x5_fullscreen: {
			type: Boolean,
			default: false
		},
		autoPlayDelay: {
			type: Number,
			default: 0
		},
		autoPlayDelayDisplayText: {
			type: String,
			default: '加载中...'
		},
		watermark: {
			type: Object,
			default: () => {
				return {
					isShow: false,
					text: '',
					width: 400,
					height: 200,
					angle: 35,
					size: 16,
					color: 'rgba(255,255,255,.3)',
					position: 'top right',
					repeat: 'repeat' // 如果设置了repeat则position无效
				};
			}
		}
	},
	data() {
		return {
			playerId:
				'aliplayer_' +
				Math.random()
					.toString(36)
					.substr(2),
			scriptTagStatus: 0,
			isReload: false,
			instance: null
		};
	},
	methods: {
		loadPlayer(url) {
			if (window.Aliplayer !== undefined) {
				// 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
				this.scriptTagStatus = 2;
				this.initAliplayer(url);
			} else {
				// 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
				this.insertScriptTag(url);
			}
		},
		insertScriptTag(url) {
			const _this = this;
			let playerScriptTag = document.getElementById('playerScriptTag');
			// 如果这个tag不存在，则生成相关代码tag以加载代码
			if (playerScriptTag === null) {
				playerScriptTag = document.createElement('script');
				playerScriptTag.type = 'text/javascript';
				playerScriptTag.src = this.aliplayerSdkPath;
				playerScriptTag.id = 'playerScriptTag';
				let s = document.getElementsByTagName('head')[0];
				s.appendChild(playerScriptTag);
			}
			if (playerScriptTag.loaded) {
				_this.scriptTagStatus++;
			} else {
				playerScriptTag.addEventListener('load', () => {
					_this.scriptTagStatus = 2;
					playerScriptTag.loaded = true;
					_this.initAliplayer(url);
				});
			}
			_this.initAliplayer(url);
		},
		initAliplayer(url) {
			const _this = this;
			let source = url ? url : this.source;
			// scriptTagStatus 为 2 的时候，说明两个必需引入的 js 文件都已经被引入，且加载完成
			if (_this.scriptTagStatus === 2 && (_this.instance === null || _this.reloadPlayer)) {
				_this.instance && _this.instance.dispose();
				// document.querySelector("#" + _this.playerId).innerHTML = "";
				// Vue 异步执行 DOM 更新，这样一来代码执行到这里的时候可能 template 里面的 script 标签还没真正创建
				// 所以，我们只能在 nextTick 里面初始化 Aliplayer
				_this.$nextTick(() => {
					_this.instance = window.Aliplayer(
						{
							id: _this.playerId,
							autoplay: _this.autoplay,
							isLive: _this.isLive,
							playsinline: _this.playsinline,
							format: _this.format,
							width: _this.width,
							height: _this.height,
							controlBarVisibility: _this.controlBarVisibility,
							useH5Prism: _this.useH5Prism,
							useFlashPrism: _this.useFlashPrism,

							vid: _this.vid,
							playauth: _this.playauth,
							source: source,
							cover: _this.cover,

							// skinLayout: _this.skinLayout, // 说明：功能组件布局配置，不传该字段使用默认布局传false隐藏所有功能组件，请参照皮肤定制
							x5_video_position: _this.x5_video_position,
							x5_type: _this.x5_type,
							x5_fullscreen: _this.x5_fullscreen,
							x5_orientation: _this.x5_orientation,
							autoPlayDelay: _this.autoPlayDelay,
							autoPlayDelayDisplayText: _this.autoPlayDelayDisplayText
						},
						player => {
							player.on('ready', () => {
								document.getElementById(this.playerId) &&
									document
										.getElementById(this.playerId)
										.getElementsByTagName('video')[0]
										.addEventListener('click', () => {
											if (player.getStatus() == 'playing' || player.getStatus() == 'ready') {
												player.pause();
											} else if (player.getStatus() == 'pause') {
												player.play();
											}
										});
								if (_this.watermark.isShow) {
									this.addWaterMask();
								}
							});

							if (_this.watermark.isShow) {
								_this.createWaterMaker();
							}
						}
					);
					// 绑定事件，当 AliPlayer 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
					_this.instance.on('ready', () => {
						this.$emit('ready', _this.instance);
					});
					_this.instance.on('play', () => {
						this.$emit('play', _this.instance);
					});
					_this.instance.on('pause', () => {
						if (document.getElementById(this.playerId)) {
							document.getElementById(this.playerId).getElementsByClassName('prism-big-play-btn')[0].style.display = 'block';
						}
						this.$emit('pause', _this.instance);
					});
					_this.instance.on('ended', () => {
						this.$emit('ended', _this.instance);
					});
					_this.instance.on('liveStreamStop', () => {
						this.$emit('liveStreamStop', _this.instance);
					});
					_this.instance.on('m3u8Retry', () => {
						this.$emit('m3u8Retry', _this.instance);
					});
					_this.instance.on('hideBar', () => {
						this.$emit('hideBar', _this.instance);
					});
					_this.instance.on('waiting', () => {
						this.$emit('waiting', _this.instance);
					});
					_this.instance.on('snapshoted', () => {
						this.$emit('snapshoted', _this.instance);
					});

					_this.instance.on('timeupdate', () => {
						_this.$emit('timeupdate', _this.instance);
					});
					_this.instance.on('requestFullScreen', () => {
						_this.$emit('requestFullScreen', _this.instance);
					});
					_this.instance.on('cancelFullScreen', () => {
						_this.$emit('cancelFullScreen', _this.instance);
					});
					_this.instance.on('error', () => {
						_this.$emit('error', _this.instance);
					});
					_this.instance.on('startSeek', () => {
						_this.$emit('startSeek', _this.instance);
					});
					_this.instance.on('completeSeek', () => {
						_this.$emit('completeSeek', _this.instance);
					});
				});
			}
		},
		/**
		 * 播放视频
		 */
		play: function() {
			this.instance.play();
		},
		/**
		 * 暂停视频
		 */
		pause: function() {
			this.instance.pause();
		},
		/**
		 * 重播视频
		 */
		replay: function() {
			this.instance.replay();
		},
		/**
		 * 获取播放器状态
		 */
		getStatus: function() {
			return this.instance.getStatus();
		},
		/**
		 * 跳转到某个时刻进行播放
		 * @argument time 的单位为秒
		 */
		seek: function(time) {
			this.instance.seek(time);
		},
		/**
		 * 获取当前时间 单位秒
		 */
		getCurrentTime: function() {
			return this.instance.getCurrentTime();
		},
		/**
		 *获取视频总时长，返回的单位为秒
		 * @returns 返回的单位为秒
		 */
		getDuration: function() {
			return this.instance.getDuration();
		},
		/**
		 获取当前的音量，返回值为0-1的实数ios和部分android会失效
		 */
		getVolume: function() {
			return this.instance.getVolume();
		},
		/**
		 * 设置音量，vol为0-1的实数，ios和部分android会失效
		 */
		setVolume: function(vol) {
			this.instance.setVolume(vol);
		},
		/**
		 *直接播放视频url，time为可选值（单位秒）目前只支持同种格式（mp4/flv/m3u8）之间切换暂不支持直播rtmp流切换
		 *@argument url 视频地址
		 *@argument time 跳转到多少秒
		 */
		loadByUrl: function(url, time) {
			if (!this.instance) {
				this.loadPlayer(url);
			} else {
				this.instance.loadByUrl(url, time);
			}
		},
		/**
		 * 设置播放速度
		 *@argument speed 速度
		 */
		setSpeed: function(speed) {
			this.instance.setSpeed(speed);
		},
		/**
		 * 设置播放器大小w,h可分别为400px像素或60%百分比chrome浏览器下flash播放器分别不能小于397x297
		 *@argument w 播放器宽度
		 *@argument h 播放器高度
		 */
		setPlayerSize: function(w, h) {
			this.instance.setPlayerSize(w, h);
		},
		/**
		 * 目前只支持HTML5界面上的重载功能,暂不支持直播rtmp流切换m3u8）之间切换,暂不支持直播rtmp流切换
		 *@argument vid 视频id
		 *@argument playauth 播放凭证
		 */
		reloaduserPlayInfoAndVidRequestMts: function(vid, playauth) {
			this.instance.reloaduserPlayInfoAndVidRequestMts(vid, playauth);
		},
		reloadPlayer: function(url) {
			this.isReload = true;
			this.initAliplayer(url);
			this.isReload = false;
		},
		/**
		 * 水印
		 */
		createWaterMaker() {
			let box = document.getElementById(this.playerId);
			let waterBg = document.createElement('div');
			waterBg.className = 'waterMakerBg';
			waterBg.id = this.playerId + 'm';
			box.appendChild(waterBg);

			let c = document.createElement('canvas');
			let ctx = c.getContext('2d');
			c.width = this.watermark.width;
			c.height = this.watermark.height;
			ctx.strokeStyle = 'transparent';
			ctx.rect(0, 0, c.width, c.height);
			ctx.rotate((this.watermark.angle * Math.PI) / 180);
			ctx.save();
			ctx.fillStyle = this.watermark.color;
			ctx.font = this.watermark.size + 'px Microsoft YaHei';
			ctx.fillText(this.watermark.text, 20, 0);
			ctx.restore();
			ctx.stroke();

			let img = c.toDataURL('image/png');

			if (this.watermark.repeat == 'no-repeat') {
				document.getElementById(this.playerId + 'm').style.backgroundImage = 'url(' + img + ')';
				document.getElementById(this.playerId + 'm').style.backgroundRepeat = 'no-repeat';
				document.getElementById(this.playerId + 'm').style.backgroundPosition = this.watermark.position;
			} else {
				document.getElementById(this.playerId + 'm').style.backgroundImage = 'url(' + img + ')';
			}

			this.addWaterMask();
		},
		/**
		 * 水印监听
		 */
		addWaterMask() {
			document.getElementById(this.playerId + 'm') &&
				document.getElementById(this.playerId + 'm').addEventListener('click', () => {
					if (this.instance.getStatus() == 'playing' || this.instance.getStatus() == 'ready') {
						this.instance.pause();
					} else if (this.instance.getStatus() == 'pause') {
						this.instance.play();
					}
				});
		}
	},
	destroyed() {
		document.getElementById(this.playerId) &&
			document
				.getElementById(this.playerId)
				.getElementsByTagName('video')[0]
				.removeEventListener('click');

		document.getElementById(this.playerId + 'm') && document.getElementById(this.playerId + 'm').removeEventListener('click');
	}
};
</script>

<style lang="postcss">
@import 'https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css';
.prism-big-play-btn {
	left: 50% !important;
	bottom: 50% !important;
	transform: translate(-32px, 32px);
}

.waterMakerBg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
