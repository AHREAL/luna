---
title: JSONP插件
date: 2019-09-16 11:11:02
updated: 2019-09-16 16:20:21
tags: 杂记
categories: 杂记
keywords:
description:
top_img: 
comments:
cover: 
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
---

## 手写一个简易JSONP插件

## 思路

#### 图示：

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589216737865_0.4743.png)

#### 关键点:

- 每次请求完成之后，必须清空产生的多余无用的方法和标签
- 包装成promise对象，使用起来就像axios一样
- 自动生成接收函数，无需用户考虑，我们要做的是把值传递回去

## 代码实现

话不多说，先上代码

```javascript
function myJsonp(options) {
	return new Promise((resolve, reject) => {
        //判断是否是第一次jsonp请求
		if (!window.jsonpNum) {
			window.jsonpNum = 1
		} else {
			window.jsonpNum++
		}

		let {					
			url,
			data,
			timeout = 5000,
			cbkey = 'callback',
		} = options
        
		//保证每次请求接收的方法都不会重复
		let funName = 'jsonpReceive' + window.jsonpNum
        
		//清除本次jsonp请求产生的一些无用东西
		function clear() { 							
			window[funName] = null
			script.parentNode.removeChild(script);
			clearTimeout(timer)
		}
		
        //定义jsonp接收函数
		window[funName] = function(res) {
            //一旦函数执行了，就等于说请求成功了
			resolve(res) 							
			clear()
		}
		
        //请求超时计时器
		let timer = setTimeout(() => {				
			reject('超时了')
			clear()
		}, timeout)
		
        //定义请求的参数
		let params = '' 								
		
        //如果有参数
		if (Object.keys(data).length) { 			
			for (let key in data) {
				params += `&${key}=${encodeURIComponent(data[key])}`;
			}
			
			params = params.substr(1)
		}
		
        //拼接最终的请求路径，结尾拼接回调的方法名
		url = url + '?' + params + `&${cbkey}=${funName}`  	

		let script = document.createElement('script');
		script.src = url;
		document.body.appendChild(script);
	})
}
```

## 调用

- 测试QQ音乐获取首页轮播图的JSONP接口

  ```javascript
  let options = {
  	url:'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  	cbkey: 'jsonpCallback',
  	data: {
  		g_tk: 1928093487,
  		inCharset: 'utf-8',
  		outCharset: 'utf-8',
  		notice: 0,
  		format: 'jsonp',
  		platform: 'h5',
  		uin: 0,
  		needNewCode: 1
  	},
  	// QQ音乐接口Jsonp字段
  }
  
  myJsonp(options)
  .then(res => {
  	console.log(res);
  },err=>{
  	console.log(err)
  })
  ```

- 结果

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589216758621_0.6443.png)

## 总结

- 代码中没有过多的进行判断，容错率较低，但是核心功能已经实现
- 会造成一个全局变量污染 jsonpNum ，当然解决方案很多，这儿就不往下拓展了