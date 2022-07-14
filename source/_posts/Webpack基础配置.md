---
title: Webpack基础配置
date: 2020-04-15 16:02:32
updated: 2020-04-16 18:29:48
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

核心功能配置，以及一些常用Loader，Plugin

### webpack.config.js

webpack的配置文件，放在项目根目录下（与node_module文件夹同级）

默认是没有的，要自己创建，文件名字就叫webpack.config.js，这个是配置文件的默认名字，就你要给他取这个名字，webpack才能识别这个配置文件，当然毕竟都是程序嘛，这也可以自定义，下面会说。



### 文件整体

**文件整体是一个node模块暴露出去的形式进行编写的**

```javascript
module.exports = {
	...
	...
	...
}
```



### 入口文件

入口文件可以设置一个或者多个，入口为一个的话一般不去改他 

```javascript
module.exports={
	entry:'./src/index.js'	//默认值
}
```



### 输出文件

output配置接受一个对象，对象两个属性分别描述输出的文件名以及输出的位置

**输出文件配置的路径必须是一个绝对路径，入口文件接收的路径可以是相对路径，这个要区分开来**

所以为了方便使用，我们引入node.js的内置模块path

```javascript
const path = require('path')

module.exports={
	output:{
		filename:'bundle.js',
		path:path.join(__dirname,'dist')
	}
}
```



## 修改配置文件的指向

配置文件可以不叫webpack.config.js，可以叫xxoo.config.js

但你就这样的话，webpack可不认识你的xxoo.config.js

方法有两种，一种是修改webpack的源码，一劳永逸，一种是通过命令行手动指定，每次都需要指定

**修改流程:**

**通过修改webpack内部源码**

1. 依次打开你项目的node_modules，webpack-cli，bin，config，config-yargs.js 这个文件

2. 搜索webpack.config.js

3. 你会搜到这么一句话

```javascript
defaultDescription: "webpack.config.js or webpackfile.js",
```

4. 用脚趾头想一下都知道这句话什么意思了，你的配置文件可以叫webpack.config.js也可以叫webpackfile.js

5. 我们修改一下，变成这样，然后保存

```javascript
defaultDescription: "webpack.config.js or webpackfile.js or xxoo.config.js",
```

6. 然后你cmd输入npx webpack的时候，你的xxoo.config.js就可以被webpack识别了。



**通过命令行指定**

1. 命令行输入

```shell
npx webpack --config xxoo.config.js 	//--config空格后面跟上你的配置文件名
```

这句话翻译一下就是：

从当前目录下的node_module文件夹里面读取webpack，根据xxoo.config.js这个配置文件进行打包。



**当然，两种指定模式是根据情况而定的，往往项目开发阶段和上线阶段的配置文件是不同的，所以视情况而定**





## Watch观察者模式

每次修改src里面的东西的时候，都要手动打包一下这是非常不友好的！

webpack提供了一个观察模式，能够监听src里面的变化，实现自动打包。

这一块内容了解就好，接下来我们用的比较多的是webpack-dev-server。



**开启方式**

开启方式有两种：

- 命令行

  输入npx webpack --watch 即开启watch模式

- 配置文件

  在webpack.config.js文件里面，我们可以配置一个和mode，entry等字段同级的 **watch**字段

```javascript
const path = require('path')
  
module.exports={
  output:{
  	filename:'bundle.js',
  	path:path.join(__dirname,'dist')
  },
  	
  //默认是false，当设置为true为开启观察者模式
  watch:true
 }
```

   



## webpack-dev-server

每次一旦修改源码，webpack就会自动打包，并自动刷新页面

**使用步骤**

1. 下载

```shell
npm i webpack-dev-server -D
```

2. 在webpack.config.js中常用配置

```javascript
  module.export = {
      ...
      devServer:{
          //打包的输出文件夹，服务器默认会去输出根目录文件夹下的index.html
          //另外一层意思是，这个地址是服务器根路径下的静态资源文件夹
          contentBase:'./dist',
          //运行服务器的时候是否自动打开网页
          open:true,
          //端口号
          port:8080,
          //是否开启热更新，热更新的意思就是无需刷新页面对代码的改动进行实时更新
          hot:true
      }
  }
```

3. 开启服务器

```shell
npx webpack-dev-serve
```



**当开启服务器的时候，webpack-dev-serve会将程序打包到内存中（所以dist文件夹里面是没有变动的），方便热更新，只是方便我们对源码进行开发，当我们开发完成，需要拿到打包完的代码进行上线操作的时候，依旧是需要执行 npx webpack才能拿到打包后的代码**





## webpack-dev-middleware

可以将webpack打包完成的文件传递给服务器，实现类似于webpack-dev-server的功能。

这是一个node的express框架的中间件，webpack-dev-server内部就是使用这个中间件来实现的。





## mode打包模式

需要在webpack.config.js中mode字段设置打包的模式

打包模式有两种

- production       生产模式

  生产模式打包会对代码进行压缩，并且混淆变量名

- development   开发模式

  开发模式打包不会对代码进行压缩，在一定程度上可以帮助开发者定位问题

如果没有设置打包模式，那么默认是使用生产模式的production，并且给你抛出一个警告



## loader(常用)

loader是webpack原有的打包能力上的一种扩展，webpack在不设置任何loader的情况下只能打包js文件。

loader涉及到AST抽象语法树的概念，这里不在深入

loader告诉webpack，当你遇到我所test的文件的时候，请用我指定的loader去进行处理



### loader的使用流程

1. 下载所需要的loader

```shell
npm i xx-loader -D
```

2. 配置loader，在webpack.config.js里面

```javascript
 module.export = {
  module: {
    rules: [
      {	//test字段表示匹配的正则，这里匹配的是以.css后缀的文件
        test: /\.css$/,
        //匹配到的文件所使用的loader，这里在数组中写loader顺序是有讲究的
        //webpack中loader的调用是从右往左的，文件处理在前，引入在后，所以从右往左写就是css-loader style-loader这个顺序
        loader: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

   **其中loader的字段还可以写成use一个数组，这个test用几个loader就使用几个对象，可以分别配置每个loader的一些选项**

```javascript
module.export = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            option: {
              ...
                        }
          },
          {
            loader: 'css-loader',
            option: {
              ...
                      }
          }
        ]
      }
    ]
  }
}
```

   

### css-loader

css-loader能够用来处理css文件，将其打包进我们要引入的js里面， 往往需要配合style-loader使用



### style-loader

style-loader能够将js文件以内联style样式的形式放进关联的html文件里面



### file-loader

file-loader可以用来处理图片文件，将其放置到输出目录，并且返回一个url



### url-loader

类似于file-loader，可以指定一个大小，当文件小于指定的大小的时候，转换成base64，当文件大于指定的大小的时候，使用和file-loader一样的处理方式，如果没有设置大小默认都是转换base64。

**注意事项：**

1. url-loader 依赖于file-loader，所以使用url-loader的时候需要先下载file-loader
2. 不需要像处理css文件一样使用css-loader和style-loader那样使用两个loader，只需要使用url-loader来处理文件即可
3. 如果文件大小大于你指定的limit，那么处理方式就和你使用file-loader一样了

**常用配置：**

1. outputPath，输出的文件夹名字

2. limit，限制的文件大小，单位字节 1024 = 1kb

3. name，转换后的文件名，[name] 为原文件名，[hash]为随机哈希字符串，[ext]为原文件扩展名

```
比如说我有个图片文件叫：index_bg.jpg
我配置的name字段为：[name]-[hash].[ext]
输出的文件名为：
index_bg-hashhashhash.ext
//其中 hashhashhash 为随机生成的哈希字符串
```

**例子**

```javascript
module:{
    rules:[
        {
            test:/\.(img|png|jpg)$/,
            use:[
                {
                    loader:'url-loader',
                    option:{
                        limit:1024*5, // 小于5kb的转换成base64
                        outputPath:'static/img', //输出路径
                        name:[name]-[hash:4].[ext]  //输出的文件名，数字4表示随机生成的4位hash
                    }
                }
            ]
        }
    ]
}
```





### babel-loader

babel，把一些新的ES语法做向下兼容转移。

首先要知道webpack本身是不会做ES6转ES5这个事情的，你写的ES6语法打包完还是ES6语法。





## plugin插件(常用)

webpack中可以使用loader扩展webpack的打包能力，除了打包以外也可以使用一些插件帮我们在打包前或者打包后做一些额外的事情





### html-webpack-plugin

能够帮我们在打包的时候将template字段中指定的html文件拷贝到dist文件夹中去，并且帮我们把指定的entry入口文件引入到这个html中，使我们无需在dist中手动创建html文件。

如果配合dev-server使用，那么会帮助我们在内存中创建一个html文件。

**使用步骤**

1. 下载html-webpacl-plugin

```
npm i html-webpack-plugin -D
```

2. 在webpack.config.js中require

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
```

3. 配置plugins，指定template

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.export = {
  entry: '...',
  output: {
    ...
       },
  module: [
    ...
       ],
  plugins: [
    //new 一个上面引进来的HtmlWebpackPlugin，实例化传递一个options对象，
    new HtmlWebpackPlugin({
      //指定template字段的值为我们在src中创建的html模板路径
      template: 'src/index.html',
      //指定的filename为打包完的html名字
      filename: 'index.html'
    })
  ]
}
```



### clean-webpack-plugin

这个插件可以帮助我们在打包之前清空dist文件夹用的

**使用步骤**

1. 下载

```shell
npm i clean-webpack-plugin -D
```

2. 引入

```javascript
//注意，这里需要用{}的方式去引入
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
```

3. 配置webpack.config.js

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.export = {
  entry: '...',
  output: {
    ...
    },
  module: [
    ...
    ],
  plugins: [
    //new 一下即可
    new CleanWebpackPlugin()
  ]
}
```

   

### hot-module-replacement-plugin(HMR插件)

首先这个插件是webpack内置的一个插件，所以无需再npm下包

这个插件是组件样式热更新插件，当你更新了组件的样式的时候，无需刷新整个页面，即可对插件的样式进行更新，当然这需要配合webpack的开发服务器一起使用。

**使用步骤**

1. 因为插件是webpack内置的，所以直接引入webpack。

```javascript
const webpack = require('webpack')
```

2. 在plugins中new一下即可

```javascript
const webpack = require('webpack')

module.export = {
  entry: '...',
  output: {
    ...
    },
  module: [
    ...
    ],
  plugins: [
    //new 一下即可
    new webpack.HotModuleReplacementPlugin()
  ]
}
```



**注意：从devServer4.3版本开始，热更新不需要装任何插件，只需要配置的时候hot字段设置为true即可，但是官方文档目前还是推荐安装HMR插件(截至目前官方文档还没更新)**



### copy-webpack-plugin

**将一些我们需要直接放进dist文件夹的东西复制进去。**

**具体使用参照官方文档，非常简单**