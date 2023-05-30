import React from 'react'
import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview'
export default function Yaogan() {

	const injectJSStr = `
	
	var rocker = document.getElementById('rocker_bg');
	var rocker_center_X = rocker.offsetLeft + rocker.offsetWidth/2;
	var rocker_center_Y = rocker.offsetTop + rocker.offsetHeight/2;
// 摇杆、摇杆相对摇杆容器的偏移距离
var sphere = document.getElementById('rocker');
var sphere_offset_top = sphere.offsetTop;
var sphere_offset_left = sphere.offsetLeft;
// 摇杆活动半径
var rocker_radius = rocker.offsetWidth/2;
// 起始坐标
var start_X;
var start_Y;
// 取消touchmove事件标志
var FLAG = true;

sphere.ontouchstart = function(e) {
    start_X = e.touches[0].clientX;
    start_Y = e.touches[0].clientY;
}
sphere.ontouchmove = function(e) { 
    e.preventDefault();
    if (!FLAG) {return;}
    // 当前坐标与起始坐标的距离
    var current_X = e.touches[0].clientX;
    var current_Y = e.touches[0].clientY;
    // 边界检测
    var distance = Math.sqrt(Math.pow(current_X - start_X, 2) + Math.pow(current_Y - start_Y, 2));
    if ( distance > (rocker.offsetWidth - sphere.offsetWidth)/2 ) {
        FLAG = false;
        // 根据摇杆与摇杆中心坐标夹角判断摇杆方向
        var coordinate_X = current_X > rocker_center_X ? current_X - rocker_center_X : current_X - rocker_center_X;
        var coordinate_Y = current_Y > rocker_center_Y ? rocker_center_Y - current_Y : rocker_center_Y - current_Y;
        var angle = Math.atan2(coordinate_Y, coordinate_X);
        // 向右
        if (angle >= -1/4*Math.PI && angle < 1/4*Math.PI) {
            console.log('向右');
        }
        // 向上
        if (angle >= 1/4*Math.PI && angle < 3/4*Math.PI) {
            console.log('向上');
        }
        // 上左
        if ((angle >= 3/4*Math.PI && angle < Math.PI) || (angle >= -1*Math.PI && angle < -3/4*Math.PI)) {
            console.log('向左');
        }
        // 向下
        if (angle >= -3/4*Math.PI && angle < -1/4*Math.PI) {
            console.log('向下');
        }
        return false;
    }
    // 摇杆跟随
    sphere.style.left = sphere_offset_left + current_X - start_X + 'px';
    sphere.style.top = sphere_offset_top + current_Y - start_Y + 'px';
}
sphere.ontouchend = function(e) {
    // 让摇杆回到摇杆容器中心、让摇杆可以重新跟随
    sphere.style.left = (rocker.offsetWidth - sphere.offsetWidth)/2 + 'px';
    sphere.style.top = (rocker.offsetHeight - sphere.offsetHeight)/2 + 'px';
    FLAG = true;
}
`






	const html = `<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Document</title>
		<style>
			* {
				margin: 0;
				padding: 0;
			}
			html {
				font-size: calc(15.625vw);
			}
			#rocker_bg {
				position: relative;
				width: 6.4rem;
				height: 6.4rem;
				background: #fff18f;
				border-radius: 50%;
			}
			#rocker {
				position: absolute;
				top: 2.2rem;
				left: 2.2rem;
				width: 2rem;
				height: 2rem;
				border-radius: 50%;
				background: #ff7867;
				z-index: 10;
			}
	
		</style>
	</head>
	<body>
		<div id="rocker_bg">
			<div id="rocker"></div>
		</div>
		<script>        setTimeout(function () {
			window.ReactNativeWebView.postMessage(window.injectStr)
		  }, 2000) </script>
	</body>
	</html>`

	return (

		<View style={{ width: 200, height: 200 }}>
			<WebView
				source={{ html }}
				style={{ flex: 1 }}
				injectedJavaScript={injectJSStr}
				mixedContentMode="compatibility" // Android: WebView 是否应该允许安全链接（https）页面中加载非安全链接（http）的内容,
			/>

		</View>
	)
}
