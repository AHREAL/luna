---
title: JSONP
date: 2019-09-15 12:11:22
updated: 2019-09-16 11:40:20
tags:
categories:
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

JSON with Padding

## 何为JSONP

	JSONP是JSON with Padding的略称，JSONP为民间提出的一种跨域解决方案，通过客户端的script标签发出的请求方式。
	
	那请求何必做得如此麻烦，直接使用ajax做请求岂不美哉，这里便要涉及到一个同源和跨域的问题。

## 同源请求和跨域请求


**同源策略，它是由Netscape网景公司提出的一个著名的安全策略。**


	现在所有支持JavaScript 的浏览器都会使用这个策略。所谓同源是指，域名，协议，端口相同。
	
	而所有非同源的请求（即 **域名，协议，端口** 其中一种或多种不相同），都会被作为跨域请求，浏览器会将其非同源的响应数据丢弃。
	
	这里可以理解为是浏览器在搞事情，服务端确确实实有返回数据，浏览器接收到返回的数据，发现我们请求的是一个非同源的数据，浏览器再将其响应报文丢弃掉。
	
	而通过一些标签发出的请求则不会被进行同源检查，比如script标签，img标签等等，本文讲述JSONP便是通过script标签做的请求。

## JSONP的实现流程

#### 图示：

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589216640335_0.2400.png)

#### 流程：

1. 在发请求先，准备一个全局的接收函数

   ```javascript
   window.myCallback = (res)=>{			//声明一个全局函数 'callback'，用于接收响应数据
       console.log(res)
   }
   ```

2. 在html创建script标签，发出请求

   ```html
   <html>
   	....
   	<script>		
   		window.myCallback = (res)=>{			//这里为上一步定义的全局函数
       		console.log(res)
   		}
   	</script>
       <script url="xxx?callback=myCallback">
       			//script标签的请求必须在写在定义全局函数之后
       			//这里需将全局函数的函数名作为参数callback的value传递
       			//这里callback这个键名是前后端约定好的
   	</script> 
   	</body>
   </html>
   ```

3. 服务端接收到请求，将如下数据相应回

   ```javascript
   myCallback({			//一个函数的调用，将数据作为参数传递进去，再将整个函数的调用返回给客户端
   	name:'ahreal',
       age:18
   })
   ```

4. 客户端接收到服务端的相应，相当于：

   ```html
   <html>
   	....
   	<script>		
   		window.myCallback = (res)=>{			//这里为上一步定义的全局函数
       		console.log(res)
   		}
   	</script>
       <script>							//将接收到的数据作为script标签里面的内容展开执行
           myCallback({					
               name:'ahreal',
               age:18
           })   			
   	</script> 
   	</body>
   </html>
   ```

5. 控制台输出

   

## JSONP和AJAX请求的异同

#### 相同点：

- 使用的目的一致，都是客户端向服务端请求数据，将数据拿回客户端进行处理。

#### 不同点：

- ajax请求是一种官方推出的请求方式，通过xhr对象去实现，jsonp是民间发明，script标签实现的请求。
- ajax是一个异步请求，jsonp是一个同步请求
- ajax存在同源检查，jsonp不存在同源检查，后端无需做解决跨域的响应头。
- ajax支持各种请求的方式，而jsonp只支持get请求
- ajax的使用更加简便，而jsonp的使用较为麻烦。