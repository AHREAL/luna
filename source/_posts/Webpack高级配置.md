---
title: Webpack高级配置
date: 2020-04-15 16:02:32
updated: 2020-04-18 20:29:48
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/webpack.jpeg
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/webpack.jpeg
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

多入口，跨域，环境变量相关

### html-withimg-loader

**真正意义上打包HTML中的图片(img标签src指向的本地图片)**

**输出文件的规则会自动根据url-loader去生成，包括命名规则，包括输出的路径**



### 多页应用的打包

**传统web开发不像现在这样都是SPA单页应用，而是一个多页的形势存在**

**很多时候我们都已经不在使用多页应用的开发模式，但是往往在一些特殊条件下需要用到多页应用，比如我们需要开发一个企业的网站，企业的网站非常注重SEO优化以及首次请求的性能。**



**啰嗦一下多页应用和单页应用的区别**

- 单页：只有一个html文件和多个js，通过js控制渲染。
- 多页：有多个html以及多个js，一般一个html对应一个js，页面间的跳转通过请求不同的html来实现。



**配置流程**

1. 需要配置多个入口文件。

```javascript
   {
       entry:{
           index:'./src/index.js',
           user:'./src/user.js'
       }
       // enter可以接受一个对象，对象的属性名为这个入口文件的变量名，值为路由文件的路径
   }
```

2. 需要配置多个出口文件。

```javascript
   {
   	output:{
   		filename:'[name].js',
   		path:path.join(__dirname,'dist')
   	}
   	// webpack的配置文件中，我们可以使用[name]来指代一个文件的变量名，如第一步配置的属性名。
   }
```

3. 需要配置多个html-webpack-plugin

```javascript
   {
      new HtmlWebpackPlugin({
           	template:'src/index.html',
           	filename:'index.html'
      }),
      new HtmlWebpackPlugin({
           	template:'src/user.html',
           	filename:'user.html'
      }),
      // 当然我们有多个html就需要生成多个html文件。
   }
```

4. 指明各个html需要用的chunk

```javascript
   {
      new HtmlWebpackPlugin({
           	template:'src/index.html',
           	filename:'index.html',
          		chunks:['index']
      }),
      new HtmlWebpackPlugin({
           	template:'src/user.html',
           	filename:'user.html'
          		chunks:['user']
      }),
   }
```





### 第三方库引入的两种方式

**场景：我希望导入一个库，并且声明到全局，随处可用。**

可以通过 **expose-loader** 进行全局声明。

也可以通过 **webpack.ProvidePlugin** 在每个模块中自动引入。

 **注意区别 ， 两者存在差异性。**



#### expose-loader

1. 安装expose-loader

```js
   npm i -D expose-loader
```

2. 配置loader

```javascript
   module:{
   	rules:[
           {
               // 解析绝对路径
               test: require.resolve('jquery'),
               // 全局声明$
               options: "$"
           }
       ]	
   }
```

   

#### webpack.ProvidePlugin

1. 无需下包，是webpack内置的一个插件

2. 配置

```javascript
   plugins: [
   	new webpack.ProvidePlugin({
          	// import .. from .. 怎么写，这里路径就怎么写。
   		$:'jquery',
           jQuery:'jquery'
   	})
   ]
```

   

**两种引入方式是不同的，第一种相当于挂在window对象上，第二种是相当于在每个模块里面import**



### 区分环境使用多套配置文件

原理是利用webpack-merge

我们一般项目中需要用到两套配置文件，一套配置用于开发时候（需要使用开发本地服务器），一套用于生产时候（需要混淆，压缩）。

需要抽离三个配置文件:

- webpack.base.js
- webpack.prod.js
- webpack.dev.js

修改package.json中的脚本， 使用 --config 去指定不同指令使用不同的配置文件

​	

### 定义环境变量

有时候我们需要对开发环境和生产环境进行区分，这时我们就需要用到环境变量来进行区分

用到的是 **webpack-DefinePlugin**

```javascript
plugin:[
    new webpack.DefinePlugin({
        IS_DEV:'true',  // 注意，这里填写的字符串会自动当成表达式解析, 比如 '1+1' 实际上是 2
        NAME:'"CRM"', // 如果需要定义字符串变量，则需要再套一层引号
    })
]
```

环境变量在代码的任何一处地方都可访问，类似于一个全局变量



### 使用devServer解决跨域问题

目前市面上三种解决跨域的方案

1. jsonp（淘汰）
2. cors （响应头Access-Control-Allow-Origin声明，需要后端接口配合）
3. proxy（代理转发） 

**这里重点讲第三点，proxy转发**

在webpack-devServer中，webpack实现一个请求中间件，当我们的请求需要跨域的时候，我们可以由devServer帮我们发送请求。

原理：

1. 我们开启dev-server，假设现在协议域名端口是  `http://localhost:8080`
2. 浏览器请求 `http://localhost:8080`，拿到我们页面和js等等
3. 假设浏览器直接向接口服务器`http://test/api/v1`直接发送请求，会触发浏览器同源安全策略，产生跨域
4. 于是我们直接请求`http://localhost:8080`，因为是同源请求，则不存在跨域问题，然后让dev-server帮助我们去转发这次请求。
5. 当dev-server拿到响应以后，在返回给浏览器。



```javascript
devServer:{
	proxy:{
        // 当请求url匹配到/api的时候，会帮助我们转发到声明的target
		'/api':{
            target:'http://test/v1'
            // rewrith能够帮助我们重写一些请求路径
       		pathRewrith:{
                '^/proxy':''
            }
	}
}
    
// 比如说现在有一个 请求， url为 /api/proxy/get_user_info
// webpack转发以后会 请求 http://test/v1/api/get_user_info
```