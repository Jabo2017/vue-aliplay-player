<template>
	<div class="prism-player" :id="playerId" :style="playStyle"></div>
</template>

<script>
export default {
	name: 'vue-aliplay-player',
	props: {
		playStyle: {
			// 播放器样式：内联样式
			type: String,
			default: ''
		},
		aliplayerSdkPath: {
			// 版本 sdk
			type: String,
			default: 'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js'
		},
		autoplay: {
			// 播放器是否自动播放
			type: Boolean,
			default: true
		},
		rePlay: {
			// 播放器自动循环播放。
			type: Boolean,
			default: false
		},
		preload: {
			// 播放器自动加载，目前仅h5可用。
			type: Boolean,
			default: true
		},
		isLive: {
			// 是否直播模式
			type: Boolean,
			default: true
		},
		playsinline: {
			// H5是否内置播放，有的Android浏览器不起作用。
			type: Boolean,
			default: true
		},
		width: {
			// 播放器宽度，可形如‘100%’或者‘100px’
			type: String,
			default: '100%'
		},
		height: {
			// 播放器高度，可形如‘100%’或者‘100px’
			type: String,
			default: '320px'
		},
		controlBarVisibility: {
			// 控制面板的实现，默认为‘hover’， 可选的值为：‘click’、‘hover’、‘always’。
			type: String,
			default: 'hover'
		},
		useH5Prism: {
			// 指定使用H5播放器。
			type: Boolean,
			default: false
		},
		useFlashPrism: {
			// useFlashPrism
			type: Boolean,
			default: false
		},
		snapshot: {
			// type: Boolean,
			type: Boolean,
			default: true
		},
		vid: {
			// 媒体转码服务的媒体Id
			type: String,
			default: ''
		},
		playauth: {
			// 播放权证
			type: String,
			default: ''
		},
		// 视频播放地址url：
		// - 单独url。
		// - 默认状态，表示使用vid+playauth。
		// - source播放方式优先级最高。
		// source支持多清晰度设置：
		// source:'{"HD":"address1","SD":"address2"}'
		source: {
			type: String,
			default: ''
		},
		// 播放器默认封面图片，请填写正确的图片url地址。
		// 需要autoplay为’false’时，才生效。
		cover: {
			type: String,
			default: ''
		},
		// // 显示播放时缓冲图标，默认true。
		showBuffer: {
			type: Boolean,
			default: true
		},
		// H5播放flv时，设置是否启用播放缓存，只在直播下起作用。
		enableStashBufferForFlv: {
			type: Boolean,
			default: true
		},
		// 指定播放地址格式，只有使用vid的播放方式时支持
		// 可选值为’mp4’、’m3u8’、’flv’、’mp3’，默认为空，仅H5支持
		format: {
			type: String,
			default: ''
		},
		// 播放器皮肤
		// 暂未启用
		skinLayout: {
			type: Array,
			default: function() {
				return [];
			}
		},
    extraInfo:{
        "x5-playsinline":""
    },
		// 声明视频播在界面上的位置，默认为“center”。
		// 可选值为：“top”，“center”
		x5_video_position: {
			type: String,
			default: 'center'
		},
		// 声明启用同层H5播放器，启用时设置的值为‘h5’
		x5_type: {
			// type: String,
			// default: 'h5'
		},
		x5_fullscreen: {
			type: Boolean,
			default: false
		},
		// 延迟播放时间，单位为秒。
		autoPlayDelay: {
			type: Number,
			default: 0
		},
		// 延迟播放提示文本
		autoPlayDelayDisplayText: {
			type: String,
			default: '加载中...'
		},
		// H5设置截图水印
		// snapshotWatermark:{
		//     left:"100",
		//     top:"100",
		//     text:"测试水印",
		//     font:"italic bold 48px 宋体",
		//     strokeColor:"red",
		//     fillColor:'green'
		//   }
		snapshotWatermark: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// Safari浏览器可以启用Hls插件播放，Safari 11除外。
		useHlsPluginForSafari: {
			type: Boolean,
			default: true
		},
		watermark: {
			// 水印
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
		},
		fullAble: {
			// 是否开启全屏设置模式
			type: Boolean,
			default: true
		},
		speedAble: {
			// 是否开启倍数
			type: Boolean,
			default: false
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
			instance: null
		};
	},
	methods: {
		/**
		 * @param {String} url
		 * 加载播放器
		 */
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
		/**
		 * @param {String} url
		 * 插入脚本
		 */
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
				let loadReponse = function() {
					_this.scriptTagStatus = 2;
					playerScriptTag.loaded = true;
					_this.initAliplayer(url);

					if (playerScriptTag.loaded) {
						playerScriptTag.removeEventListener('load', loadReponse);
						playerScriptTag.loaded = false;
					}
				};
				playerScriptTag.addEventListener('load', loadReponse);
			}
			_this.initAliplayer(url);
		},
		/**
		 * @param {String} url
		 * 初始化播放器
		 */
		initAliplayer(url) {
			const _this = this;
			let source = url ? url : this.source;
			// scriptTagStatus 为 2 的时候，说明两个必需引入的 js 文件都已经被引入，且加载完成
			if (_this.scriptTagStatus === 2 && source) {
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
							rePlay: _this.rePlay,
							preload: _this.preload,
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
							showBuffer: _this.showBuffer,
							snapshot: _this.snapshot,
							snapshotWatermark: _this.snapshotWatermark,
							// skinLayout: _this.skinLayout, // 说明：功能组件布局配置，不传该字段使用默认布局传false隐藏所有功能组件，请参照皮肤定制
							x5_video_position: _this.x5_video_position,
							x5_type: _this.x5_type,
              extraInfo: _this.extraInfo,
							x5_fullscreen: _this.x5_fullscreen,
							x5_orientation: _this.x5_orientation,
							useHlsPluginForSafari: _this.useHlsPluginForSafari,
							enableStashBufferForFlv: _this.enableStashBufferForFlv,
							autoPlayDelay: _this.autoPlayDelay,
							autoPlayDelayDisplayText: _this.autoPlayDelayDisplayText
						},
						player => {
							player.on('ready', () => {
								_this.readyResponse();
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
		 * ready 注册事件
		 */
		readyResponse() {
			document.getElementById(this.playerId) &&
				document
					.getElementById(this.playerId)
					.getElementsByTagName('video')[0]
					.addEventListener('click', this.changePlayStatu);

			if (this.fullAble) {
				document.getElementById(this.playerId) &&
					document
						.getElementById(this.playerId)
						.getElementsByTagName('video')[0]
						.addEventListener('dblclick', this.changeFullStatu);
			}

			if (!this.speedAble) {
				if (document.getElementById(this.playerId) && document.getElementById(this.playerId).querySelector('.prism-setting-speed')) {
					document.getElementById(this.playerId).querySelector('.prism-setting-speed').style.display = 'none';
				}
			}
		},
		/**
		 * 播放暂停切换
		 */
		changePlayStatu() {
			if (this.getStatus() == 'playing' || this.getStatus() == 'ready') {
				this.pause();
			} else if (this.getStatus() == 'pause') {
				this.play();
			}
		},
		/**
		 * 全屏切换
		 */
		changeFullStatu() {
			if (this.getFullStatus()) {
				this.cancelFull();
			} else {
				this.setFull();
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
		/**
		 * @param {String} url
		 * 重载播放器
		 */
		reloadPlayer: function(url) {
			this.initAliplayer(url);
		},
		/**
		 * 获取全屏状态
		 * 仅H5支持
		 */
		getFullStatus() {
			return this.instance.fullscreenService.getIsFullScreen();
		},
		/**
		 * 设置全屏
		 * 播放器全屏，仅H5支持。
		 */
		setFull() {
			this.instance.fullscreenService.requestFullScreen();
		},
		/**
		 * 取消全屏
		 * 仅H5支持
		 */
		cancelFull() {
			this.instance.fullscreenService.cancelFullScreen();
		},
		/**
		 * 播放器销毁
		 */
		dispose() {
			this.instance && this.instance.dispose();
		},
		/**
		 * @param {String} coverUrl
		 * cover封面地址
		 */
		setCover(coverUrl) {
			this.instance.setCover(coverUrl);
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
			document.getElementById(this.playerId + 'm') && document.getElementById(this.playerId + 'm').addEventListener('click', this.changePlayStatu);

			if (this.fullAble) {
				document.getElementById(this.playerId + 'm') && document.getElementById(this.playerId + 'm').addEventListener('dblclick', this.changeFullStatu);
			}
		}
	},
	beforeDestroy() {
		document.getElementById(this.playerId) &&
			document
				.getElementById(this.playerId)
				.getElementsByTagName('video')[0]
				.removeEventListener('click', this.changePlayStatu);

		document.getElementById(this.playerId) &&
			document
				.getElementById(this.playerId)
				.getElementsByTagName('video')[0]
				.removeEventListener('dbclick', this.changeFullStatu);

		document.getElementById(this.playerId + 'm') && document.getElementById(this.playerId + 'm').removeEventListener('click', this.changePlayStatu);

		document.getElementById(this.playerId + 'm') && document.getElementById(this.playerId + 'm').removeEventListener('dblclick', this.changeFullStatu);

		this.dispose();
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
