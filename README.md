# vue-aliplay-player

## description
```
    基于阿里云播放器封装的Vue播放器插件
```

## component setup
```
npm i vue-aliplay-player -save
```

### import
```
import player from 'vue-aliplay-player'
import 'vue-aliplay-player/lib/vue-aliplay-player.css'
```

### props
``` js
  playStyle: {  // 播放器样式
	    type: String,
	    default: ''
  },
  aliplayerSdkPath: { // sdk 版本
	    type: String,
	    default: 'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js'
  },
  autoplay: {  // 自动播放：播放浏览器不支持
		type: Boolean,
		default: true
	},
	isLive: {  // 是否直播设置
		type: Boolean,
		default: true
	},
	playsinline: {
			// H5是否内置播放，有的Android浏览器不起作用。
		type: Boolean,
		default: true
	},
	width: {  // 播放器宽度
		type: String,
		default: '100%'
	},
	height: { // 播放器高度设置
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
	source: {  // 视频源权限最高
		type: String,
		default: ''
	},
	cover: {  // 封面
		type: String,
		default: ''
	},
	format: { // 播放格式
		type: String,
		default: 'm3u8'
	},
	skinLayout: { // 布局
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
	autoPlayDelay: {  // 延迟播放
		type: Number,
		default: 0
	},
	autoPlayDelayDisplayText: { // 延迟提示
		type: String,
		default: '加载中...'
	},
	watermark: {  // 水印
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

```

### methods
``` js
> 1、loadPlayer(url);  // 加载播放器 URL可选，不填选择props 中的source

> 2、play();  // 播放

> 3、pause(); // 暂停

> 4、replay(); // 重播

> 5、seek(time);  // 跳转到某个时刻进行播放 【录播】，单位秒

> 6、getCurrentTime(); // 获取当前时间 单位秒

> 7、getDuration(); // 获取视频总时长，返回的单位为秒

> 8、getVolume(); // 获取当前的音量，返回值为0-1的实数ios和部分android会失效

> 9、setVolume(); // 设置音量，vol为0-1的实数，ios和部分android会失效

> 10、setSpeed(speed); // 设置播放速度

> 11、setPlayerSize(w, h); // 设置播放器大小w,h可分别为400px像素或60%百分比chrome浏览器下flash播放器分别不能小于397x297

> 12、reloaduserPlayInfoAndVidRequestMts(vid, playauth); //目前只支持HTML5界面上的重载功能,暂不支持直播rtmp流切换m3u8）之间切换,暂不支持直播rtmp流切换

/**
*直接播放视频url，time为可选值（单位秒）目前只支持同种格式（mp4/flv/m3u8）之间切换暂不支持直播rtmp流切换
*@argument url 视频地址
*@argument time 跳转到多少秒
 */
> 13、 loadByUrl(url, time);

> 14、reloadPlayer(url); // 重新加载播放器(url：可选)

> 15、createWaterMaker(); // 水印设置，请先配置 props 中 watermark

```

### 参数配置参考
[阿里云播放器配置](https://helpcdn.aliyun.com/document_detail/125572.html?spm=a2c4g.11186623.4.1.27961c4cl6VC7x)