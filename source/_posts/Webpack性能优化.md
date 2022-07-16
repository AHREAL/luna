---
title: Webpack性能优化
date: 2020-05-02 16:02:32
updated: 2020-06-01 18:29:48
tags: Webpack
categories: 前端工程化
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

打包性能优化及包体积优化，缓存等。

### Production模式自带的打包优化

首先， 在使用webpack的时候不要用common.js规范去导入和导出，一定要使用 **es6的导入和导出**，只有使用了es6的导入和导出，production模式自带的一些打包优化（tree shaking, scope hoisting）才可以生效。

- tree shaking （树摇晃，名字很形象，树摇晃掉不需要的东西）

  - tree shaking 是一个专业术语（树摇晃），能够帮我们剔除一些引入但未使用的依赖关系，只导入，不使用，则不会打包。
  - 具名导入的时候 ( import { xx } from '...' )， 只会打包具体引入的东西，没引入的则不会打包
  - 即使具名导入了，没有使用到， 也不会被打包进来。
  - 只有在使用 es6 导入导出语法才有效 ( export, import )， 使用Common.js（module.export , require）时候不生效，因为不是按需导入导出， 是整个模块的导入导出，所以tree shaking无法生效

  **这也是为啥， 如果使用es6导入导出的时候，语法会要求你import一定要写在顶部，是为了确保其是静态资源，导入行为是确定好了的，而不是不可预料的。**

  **这里要注意，如果第三方库没有使用的情况下，不要随意引入，因为第三方库有可能使用的是Common.js规范进行导出(module.exports)，这时候tree shaking无法生效， 一样会被打包进去dist**

- scope hoisting（作用域提升）

  - 分析模块之间的依赖关系，把打散的模块尽可能合并到一个函数中去，为的是打包出来的包更小

- 代码压缩 

  - UglifyJsPlugin插件进行代码的压缩，混淆



### CSS优化

#### 抽离css到独立的文件

使用**mini-css-extract-plugin**可将css提取成独立单位，对每个包含css的js文件都会单独创建一个css文件

好处：

- 懒加载
- 不重复编译
- 更容易使用
- 只针对css

使用步骤：

1. 下载 npm i mini-css-extract-plugin -D

2. 在webpack中引入插件

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
```

3. 在plugins里，new一下

```javascript
plugins:[
    new MiniCssExtractPlugin({
        filename:'[name].css'
    })
]
```

4. 替换 loader(如果原来用的是 style-loader)， 换成 MiniCssExtractPlugin.loader

```javascript
{
    test:/\.css$/,
    // use: [ 'style-loader', 'css-loader' ]
    use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
}
```

#### 自动添加css前缀

借助 postcss-loader的**autoprefixer**可以帮助我们自动为css添加一些浏览器兼容性前缀，

**postcss-loader是一个webpack的第三方loader，他上面集成了很多对css的操作，比如自动前缀，语法兼容，作用域样式等等。**

这里只介绍postcss-loader结合autoprefixer进行介绍，更多postcss的插件用法详见[postcss官网](https://www.postcss.com.cn/)

使用步骤：

1. 下载

```javascript
npm i -D postcss-loader autoprefixer
```

2. webpack配置loader

```javascript
{
    test:/\.css$/,
    // 注意，这里要写在css-loader右侧第一位
    use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader' ]
}
```

3. 根目录创建postcss.config.js

```javascript
   const AutoPreFixer = require('autoprefixer')
   
   module.exports = {
       plugins:[
           AutoPreFixer
       ]
   }
```

#### css压缩

在webpack4中，默认css是没有压缩的

我们可以借助 optimize-css-assets-webpack-plugin完成css压缩。

由于webpack4默认是没有css压缩的，所以我们需要涉及到webpack.optimization字段的配置，这里有一点值得注意的是 **一旦配置了optimization里面的内容，那么webpack默认的代码压缩就会全部失效，比如UglifyJsPlugin，所以我们在修改optimization的同时，记得配置上js的代码压缩**

使用步骤：

1. 下载

```javascript
   npm i -D optimize-css-assets-webpack-plugin terser-webpack-plugin
```

2. 导入

```javascript
   const TerserJsPlugin = require('terser-webpack-plugin')
   const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
```

3. 配置webpack.config的optimization字段

```javascript
   {
   	optimization:{
   		minimizer:[
               // 配置Terser是由于UglifyJsPlugin不生效了，我们干脆使用TerserJs代替
               // 当然你想继续使用UglifyJsPlugin也可以，详见UglifyJs文档
   			new TerserJsPlugin({}),
   			new OptimizeCssAssetsPlugin({}),
   		]
   	}
   }
```



### JS优化

在默认情况下， webpack在打包的时候，会将我们所有的js打包到一个bundle里面去，但是如果我们项目非常大的时候，我们如果还是使用一个bundle的时候，那么这个bundle文件将会非常非常的大，可能几十M甚至上百M，所以我们需要将代码进行Code Splitting，当用户需要的时候，再按需加载即可。

一般可从三个角度去进行优化

- 入口起点：在entry配置多个入口，手动分离代码

- 抽离公共模块：使用SplitChunksPlugin去重和分离chunk

- 动态导入（路由懒加载）：通过模块内联函数的调用分离代码

  

#### 抽取公共代码

在webpack 4中， 我们可以直接使用**SplitChunksPlugin**来对代码进行分割

这里值得一提的是， 在webpack中文文档里，依然是让我们使用**CommonsChunkPlugin**来对公共模块进行抽离，但是在英文文档里已经提示**CommonsChunkPlugin**在V4版本后被移除了，并且让你转而使用**SplitChunksPlugin**，所以如果你用的webpack是v4版本，并且你跟着中文文档去操作，那么就是一个天坑。

SplitChunksPlugin的使用无需任何下载和引用，此插件的配置已经被webpack继承到了webpack.config.js里面的**optimization**字段中去。

我们只需要在optimization中配置：

```javascript
{
	optimization:{
		splitChunks:{
            chunks:'all'
        }
	}
}
```

即可解决多个bundle重复打包公共模块



#### 动态导入（懒加载）

首先我们都知道，在Webpack中，推崇使用ES6导入导出语法（import/export）， 但是Webpack4中ES6的导入默认是只支持静态的导入，也就是在代码层面已经决定了是否真正的导入了进来

关于ES6静态的导入

```jsx
// 默认情况下 import 只能写在js顶部， 因为这是静态导入，所以一开始就要确认
import React from 'react'

import { Button } from 'antd'

function MyPages = () => {
  const handleClick = () => {
    // 不可以除了顶部以外，写静态导入import
    // import moment from 'moment'
    // 当然你可以使用commonJs规范的require,因为require本身就是一个动态导入
    const moment = require('moment')
    return moment
  }
  
  
  return (
    <Button onClick={()=>console.log(handleClick())}>this is a button</Button>
  )
}
```

而ES6中

所以我们需要让webpack能够识别动态导入的语法，需要借助babel的插件包

1. 安装

```shell
npm i -D @babel/plugin-syntax-dynamic-import
```

2. 修改.bablerc配置文件

```javascript
{
    "presets":["@babel/env"],
    "plugins":[
        // 插入这么一条
        "@babel/plugin-syntax-dynamic-import"
    ]
}
```



当我们做完上述两步操作以后， 我们便可以使用import()这个方法了。

当import作为方法直接调用的时候，此时即为动态导入

```javascript
const lazyRouter = (path) => {
    // import作为方法调用的时候，本身用的便是promise去实现的
    // 这里形参使用解构赋值的方式重新命名
    return import(path).then(({defalut:router})=>{
        return router
    })
}

// 上述方法便可以实现一个简单的路由懒加载，当需要的时候，给定一个path, 返回一个js文件
```



#### SplitChunksPlugin配置参数

首先先是默认的配置参数如下

```javascript
{
    ...
    optimization:{
        splitChunks: {
            chunks: "async", 
              // 表示什么类型的chunks进行代码分离 async(按需加载块) initial(初始块) all(全部块)
            minSize: 30000, 
              // 表示最少大于多少b才进行拆分，默认是30kb
            maxSize: 0, 
             //表示拆分完最大的大小，0表示无上限，当大于maxSize的时候，会对其进行进一步拆分，比如说拆分完发现一个bundle有50kb， 我们maxSize设置为30000, 则会进一步拆分
            minChunks: 1,
             // 表示模块最少被引用几次才会拆分， 默认是只要引用一次，且达到其他要求就会被拆分
            maxAsyncRequests: 5, 
            // 表示异步加载同时最多有多少个， 多出来的部分不会被拆分，会被直接打包进去
            maxInitialRequests: 3,
             //表示初始加载最大的请求个数， 如果超过3个的部分也不会被拆分
            automaticNameDelimiter: '~',
             // 表示拆分完的chunk文件命名的时候用什么符号连接
            name: true,
             // true表示会根据cacheGroups的key来进行命名， 比如默认情况下，当入口文件为main.js，经过split拆分以后得到main.js 和 vendors~main.js
            cacheGroups: {
             // cacheGroups缓存组，模块首先需要满足上面的配置条件，完了以后再决定打包进哪个cacheGroup, 每个cacheGroup默认情况下是一个js文件， 
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    // 表示匹配来自node_modules下的模块
                    priority: -10
                    // 表示优先级， 当一个要被分割的模块满足多个group的要求时候，他服从优先级大的组
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                   	// 表示当一个模块被多次引用的时候， 复用之前打包的， 不再切割
                }
            }
        }
    }
    ...
}
```

**cacheGroups里的规则会覆盖公共规则（cachaGroup平级字段），理论上来说，cachaGroup里的规则应该设置比公共规则更加严格**



#### 构建性能优化（打包速度优化）

##### noParse

noPase是webpack的一个配置项，众所周知，webpack会自动去解析模块之间的依赖关系，noParse告诉webpack无需解析某些模块的依赖关系（**前提是你得确保该模块没有依赖其他模块**），比如jQuery或者Bootstrap。

配置方法：

```javascript
{
	module:{
		noParse:/jquery|bootstrap/, // noParse配置的是一个正则表达式
	}
}
```



##### include

在配置loader的时候，我们一般不会对node_modules下的模块进行处理，所以我们常常会配置**exclude**

```javascript
{
	test:/\.js$/,
    use:{
        loader: 'babel-loader',
    },
    exclude: /node_modules/,  //表示不对node_modules下的js文件进行babel-loader的处理
}
```

我们可以再加上一句**include**

```javascript
{
	test:/\.js$/,
    use:{
        loader: 'babel-loader',
    },
    exclude: /node_modules/,  //表示不对node_modules下的js文件进行babel-loader的处理
    include: path.resolve(__dirname, '../src'), //表示只对src下的代码进行处理
}
```



##### 原则

- 尽可能少的去使用loader，因为很大程度上loader会对构建速度造成很大的影响



##### IgnorePlugin

指定忽略哪些import和require，我们可以忽略一些我们不需要的东西，从而减少打包完的大小。

其中，我们拿moment.js来举例：

moment.js自身集成多国语言，在打包的时候会自动将所有语言的翻译文件打包进来，这会导致包特别的大。

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589208321734_0.6238.png)

其中左边都是语言包文件，而真正moment.js本体只有右边那一部分。

而如果项目中，无需这些语言包的支持或者说，我们只需要用到中文的语言包，那么我们可以直接过滤掉我们不需要的语言包。

```javascript
plugins:[
   new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/, // 这个字段表示我们需要过滤的东西
        contextRegExp: /moment$/	// 这个字段表示需要过滤的路径上下文(模块)
	}), 
]
```



### DLL

DLL中文称之为**动态链接库**，可将多个应用程序公用的代码和数据抽离出来的文件称之为DLL，可更大程度上的对代码进行抽离和复用。

默认情况下，webpack会将所有代码（包括node_modules）的依赖进行分析，对其进行code splitting等一系列操作。

但其实我们知道，我们项目中有很大一部分的代码是第三方的模块，一般来说不会对其代码进行修改操作，所以他们最后打包输出的结果是不变的，但每次打包都得其进行操作，则会极大程度上影响打包的效率，所以我们将其不会改变的模块代码(比如React,Vue等一些框架)打包成DLL使用。

把一些不变的代码打包成DLL，完了以后我们每次打包只打包我们的业务代码（src），这样可以极大提高打包的效率。

**使用步骤**

以下拿jQuery和moment.js来进行举例

1. 创建一个专门打包Dll的config，抽取Dll

```javascript
const path = require("path");

const webpack = require('webpack')

const Config = {
  entry: {
    vendors:['jquery', 'moment']
  },
  output: {
    filename: "[name]_dll.js",
    path: path.resolve(__dirname,"../dll"),
    library: "[name]_dll"
  },
  mode:'production',
  plugins: [
      new webpack.DllPlugin({
          name: "[name]_dll",
          path: path.resolve(__dirname,"../dll/[name]_manifest.json"),
      })
  ]
};

module.exports = Config
```

2. 在webpack.config.js指定manifest

```javascript
plugins:[
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dist/vendors_manifest.json"),
    }),
]
```

3. 导入asset， 这里借助add-asset-html-webpack-plugin

```javascript
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

{
plugins: [
        new AddAssetHtmlPlugin({
          filepath: path.resolve(__dirname, "../dist/vendors_dll.js")
        }),
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, "../dist/vendors_manifest.json"),
        })
      ]
}
```

**这里值得注意的是，不要什么库都使用Dll包装起来，比如antd, element-ui这些，因为这些我们常用按需导入的方式进行使用，如果我们打包成Dll，那么他就会一整个库都塞进Dll， 导致Dll过大，即使你优化了打包性能，但是牺牲了就是体积了。**



### 合理利用缓存加快访问速度

合理利用缓存加快访问速度，我们都知道将node_modules下的代码尽可能抽离成DLL，一来加快打包，而来将其代码缓存到用户的浏览器。

而我们的业务逻辑代码，则希望用户尽可能的也缓存起来，只有在我们修改业务逻辑代码的时候，用户才去更新缓存，这里我们可以利用输出占位符**[contenthash]**去实现



### 打包分析

- 使用json分析

  1. 命令行执行

```javascript
webpack --profile --json > state.json --config 你的打包配置文件
```

  2. 将json文件放入官方网站进行分析official analyze tool

- 使用webpack-bundle-analyzer

  1. 下载

```shell
npm install --save-dev webpack-bundle-analyzer
```

  2. 导入

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

  3. 直接打包

```shell
npm run build
```



### 覆盖率

**coverage rete**

指的是一个项目的资源载入和使用情况占比， 越高越好。

**查看覆盖率**

可以借助Chrom浏览器的开发者工具（默认情况下是隐藏的）

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589208662980_0.2849.png)
按照图示打开查看覆盖率工具。

**优化原则**

覆盖率越高越好，但是前提是我们应当事先优化整体的包体积，在确认包体积无法继续压缩时候，进而再去优化覆盖率。

**最有效的优化覆盖率方式：尽可能多的使用懒加载**

### Prefetching与Preloading

[Prefetching/Preloading modules](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)

在使用懒加载的时候， 能够有效提高我们首屏加载的性能，但存在一个问题就是我们每次访问某一个页面，都需要加载一点数据。我们可以用**Prefetching**，在用户加载完首屏资源后的闲时，继续加载用户可能接下来需要请求的数据。

通过注释的形式，表明某个`chunk` 使用 ` Prefetch`

```javascript
import(/* webpackPrefetch: true */ 'LoginModal');
```

在执行到这个模块代码的时候，等到所有需要同步模块加载完毕的时候，立即加载该异步模块。

而 **Preloading** 指的是提高某些资源请求的优先级

所以，对于那些可能在当前页面使用到的资源可以利用 `Preload`，而对一些可能在将来的某些页面中被使用的资源可以利用 `Prefetch`。如果从加载优先级上看，`Preload` 会提升请求优先级；而Prefetch会把资源的优先级放在最低，当浏览器空闲时才去预加载。