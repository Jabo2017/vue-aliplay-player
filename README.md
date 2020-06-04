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
  // 声明视频播在界面上的位置，默认为“center”。
  // 可选值为：“top”，“center”
  x5_video_position: {
  	type: String,
  	default: 'center'
  },
  // 声明启用同层H5播放器，启用时设置的值为‘h5’
  x5_type: {
  	type: String,
  	default: 'h5'
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

> 16、getStatus(); // 获取播放器状态

> 17、getFullStatus(); // 获取全屏状态 仅H5

> 18、setFull(); // 设置全屏

> 19、cancelFull(); // 取消全屏

> 20、dispose(); // 销毁播放器

> 21、setCover(coverUrl); // 设置封面

```

### 版本说明
1、2.0.3： 新增倍数开启关闭需求

### 参数配置参考
[阿里云播放器配置](https://helpcdn.aliyun.com/document_detail/125572.html?spm=a2c4g.11186623.4.1.27961c4cl6VC7x)