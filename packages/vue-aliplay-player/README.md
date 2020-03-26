# vue-aliplay-player

## component setup
```
npm i vue-aliplay-player -save
```

### import
```
import player from 'vue-aliplay-player'
```

### props
``` js
autoplay: {  // 自动播放设置
	type: Boolean,
	default: true
},
isLive: {  // 是否直播设置
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
source: { // 播放源
	type: String,
	default: ''
},
cover: {  // 封面
	type: String,
	default: ''
},
format: { // 格式
	type: String,
	default: 'm3u8'
},
watermark: { // 水印设置
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

> 5、 
/**
*直接播放视频url，time为可选值（单位秒）目前只支持同种格式（mp4/flv/m3u8）之间切换暂不支持直播rtmp流切换
*@argument url 视频地址
*@argument time 跳转到多少秒
 */
loadByUrl(url, time);

> 6、reloadPlayer(url); // 重新加载播放器(url：可选)

> 7、createWaterMaker(); // 水印设置，请先配置 props 中 watermark

```
