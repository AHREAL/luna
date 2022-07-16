---
title: Webpack原理深入
date: 2020-06-02 16:02:32
updated: 2020-06-05 18:29:48
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

依赖分析，_\_webpac_require__，loader，plugin等。

## 前言

一些关于Webpack较为深入的学习记录😈。

## bundle

`bundle`文件里面到底是什么？

一个简单的例子。

`index.js` 和 `other.js` 打包输出 `bundle.js`

```javascript
// index.js
const other = require('./other')
console.log(other.message)
```

```javascript
// other.js
module.exports = {
  message:'success'
}
```

```javascript
// bundle.js
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const other = __webpack_require__(/*! ./other */ \"./src/other.js\")\r\n\r\nconsole.log(other.message)\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/other.js":
/*!**********************!*\
  !*** ./src/other.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\r\n  message:'success'\r\n}\n\n//# sourceURL=webpack:///./src/other.js?");

/***/ })

/******/ });
```

观察归纳得出，bundle文件有几个关键点：

1. 一个匿名自执行函数，接收形参`modules`，函数内部定义加载器函数`__webpack_require__`，缓存对象等等，该匿名函数我们记为 `initFn`
2. 匿名函数传递参数`modules`，为依赖组成的模块表，结构为键值对，键为模块的路径，值为函数，接收形参`module`，`exports`，`__webapck_require__`，函数体内部为依赖模块代码字符串。
3. `initFn`函数内部最后调用`entry`文件路径，开始触发模块执行。
4. 模块内部的依赖导入，调用`__webpack_require__`，实则为一个递归模块调用。



**moduleA>moduleB>moduleC**

假设模块A依赖模块B，模块B依赖模块C

入口文件从模块A开始，模块A代码执行到`__webpack_require__`，加载器加载模块B，同理，当**依赖链**最后全部加载完了，模块A的代码require函数得到了返回值，代码继续往下执行。



## webpack_require函数

`__webpack_require__` 函数为webpack内部实现的一个 **模块加载器** 函数，负责处理模块的导入导出。

```javascript
function __webpack_require__(moduleId) {
  // Check if module is in cache
  if (installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  // Create a new module (and put it into the cache)
  var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
  };

  // Execute the module function
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

  // Flag the module as loaded
  module.l = true;

  // Return the exports of the module
  return module.exports;
}
```

在浏览器环境，浏览器是不支持我们所写的导入导出关键字，于是我们将多个模块都打包进一个js文件，每个模块在自己 **闭包环境 **下互相隔离开，之间通过模块的导入导出进行模块间的通信， 而其中，模块的导入便是由`__webpack_require__`函数实现。

它做了如下几件事。

1. 在内存中检查模块是否之前加载过了，加载过则读取之前的缓存并返回暴露的内容，之后加载器函数，未加载则创建一个新的模块对象。
2. 使用`call`执行模块代码函数，将模块代码函数的`this`指向为当前模块，且传递模块自身的export空间供模块内部去暴露数据。
3. 将模块对象标记为`loaded`状态。
4. 返回模块对象的export字段。



## chunk

 除了bundle，webpack还有**chunk**这个概念，chunk用于存储使用了**动态导入**的代码。

假设我有：

- index.js
- other.js

```javascript
// index.js
const other = import('./other.js')
console.log(other.name)

// other.js
export default { name:'ahreal' }
```

经过webpack打包过后，我们会得到`bundle.js`以及`chunk.js`（文件名为自行配置）



## 动态导入

webpack使用`jsonp`的方式，在`__webpack_require__`方法上挂载了`requireEnsure`方法（webpack使用`e`作为方法名）以及`webpackJsonpCallback`，内部实现了动态导入。

**`__webpack_require__.e`**

```javascript
__webpack_require__.e = function requireEnsure(chunkId) {
  var promises = [];
  // JSONP chunk loading for javascript
  var installedChunkData = installedChunks[chunkId];
  if (installedChunkData !== 0) { // 0 means "already installed".
    // a Promise means "currently loading".
    if (installedChunkData) {
      promises.push(installedChunkData[2]);
    } else {
      // setup Promise in chunk cache
      var promise = new Promise(function (resolve, reject) {
        installedChunkData = installedChunks[chunkId] = [resolve, reject];
      });
      promises.push(installedChunkData[2] = promise);
      // start chunk loading
      var script = document.createElement('script');
      var onScriptComplete;
      script.charset = 'utf-8';
      script.timeout = 120;
      if (__webpack_require__.nc) {
        script.setAttribute("nonce", __webpack_require__.nc);
      }
      script.src = jsonpScriptSrc(chunkId);
      // create error before stack unwound to get useful stacktrace later
      var error = new Error();
      onScriptComplete = function (event) {
        // avoid mem leaks in IE.
        script.onerror = script.onload = null;
        clearTimeout(timeout);
        var chunk = installedChunks[chunkId];
        if (chunk !== 0) {
          if (chunk) {
            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
            var realSrc = event && event.target && event.target.src;
            error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
            error.name = 'ChunkLoadError';
            error.type = errorType;
            error.request = realSrc;
            chunk[1](error);
          }
          installedChunks[chunkId] = undefined;
        }
      };
      var timeout = setTimeout(function () {
        onScriptComplete({ type: 'timeout', target: script });
      }, 120000);
      script.onerror = script.onload = onScriptComplete;
      document.head.appendChild(script);
    }
  }
  return Promise.all(promises);
};
```



**`webpackJsonpCallback`**

```javascript
function webpackJsonpCallback(data) {
	var chunkIds = data[0];
  	var moreModules = data[1];
  
	var moduleId, chunkId, i = 0, resolves = [];
	for(;i < chunkIds.length; i++) {
		chunkId = chunkIds[i];
		if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
			resolves.push(installedChunks[chunkId][0]);
		}
		installedChunks[chunkId] = 0;
	}
	for(moduleId in moreModules) {
		if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
			modules[moduleId] = moreModules[moduleId];
		}
	}
	if(parentJsonpFunction) parentJsonpFunction(data);

		while(resolves.length) {
		resolves.shift()();
	}

};
```



### 实现流程

webpack动态导入的完整实现逻辑流程

1. 源码`import(xx)`会被webpack编译成`__webpack_require__.e(0)(id).then`
2. 调用`__webpack_require__.e`方法，传入`chunkId`
   1. 检查`installedChunkData`（用户存储已加载的chunk）是否存在接收的`chunkId`
      1. 存在且已加载完成，直接返回一个resolve状态的Promise
      2. 存在但尚未加载完成，返回上次存进去的Promise
      3. 不存在，则创建Promise，并以格式`[resolve,reject,promise]`的形式存储进`installedChunkData`
      4. 创建`script`标签，请求chunk，并挂载一系列监听器（onErrorListener，onLoadListener）
3. 当请求的`chunk.js`收到响应，会执行`window[webpackJsonp]`的push（此方法已被使用`webpackJsonpCallback`重写）方法。
4. 调用`webpackJsonpCallback`，传入`chunk`数据，`[chunkIds, chunkModules]`
5. 在`installedChunkData`寻找对于的`chunkId`，取出`resolve`， 并将其标记为已加载。
6. 将`chunkModules`加入到当前`bundle`的`modules`
7. 调用`resolve`。
8. 执行`script`标签的`onLoad`，检查是否存在加载异常，卸载监听器等操作。
9. 业务代码中的`then`方法执行，调用`__webpack_require__`方法，执行模块代码。



### parentJsonpFunction

在`webpackJsonpCallback`方法中，检查了是否存在`parentJsonpFunction`，如果存在，则调用`parentJsonpFunction`。

`parentJsonpFunction`，主要用于解决多入口文件时候，不同的bundle加载相同的chunk导致的重复请求问题。



**bundle初始化时parentJsonpFunction**

```javascript
var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
jsonpArray.push = webpackJsonpCallback;
jsonpArray = jsonpArray.slice();
for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
var parentJsonpFunction = oldJsonpFunction;
```



举个例子，假设我们有`bundle1.js`，`bundle2.js`，`chunk.js`

1. 执行bundle1，声明全局变量数据`webpackJsonp`，重写`push`方法，指向为自身的`webpackJsonpCallback`，内部变量`parentJsonpFunction`， 指向数据的`push`方法
2. 执行bundle2，再次重写全局变量`webpackJsonp`的`push`方法，指向为自身的`webpackJsonpCallback`，内部变量`parentJsonpFunction`， 指向`bundle1`的`parentJsonpFunction`
3. bundle1动态加载chunk.js
4. 执行的是 **bundle2** 的 `webpackJsonpCallback`（bundle2在初始化的时候又重写了）
5. bundle2 会将chunk 代码 挂载在自身的`modules`里
6. bundle2 会调用 bundle1 的 `webpackJsonpCallback` 方法， 挂载`chunk`

这会，bundle1和bundle2都拥有了chunk的代码，下次bundle2加载chunk的时候，就可以去内存中读取，而不会再次请求。





## loader

在Webpack中，loader扮演了一个非常重要的角色，即对一段匹配成功的代码进行加工处理，最后处理完的代码会被webpack打包进最后生成的文件中。

loader可将所有类型的文件转换为webpack能够处理的有效模块，然后你就可以利用webpack的打包能力，对它们进行处理。

我们知道webpack依赖分析是一种递归的形式去遍历，一旦在js文件中遍历到导入`import xx from xx`或者`const xx = require(xx)` 之类的函数，webpack会对路径进行查找，查找到对应文件之后，webpack会将`src`其放到`rules`配置项里面去匹配相应的处理loader，最后将处理完的源码放进`bundle`中。

实质上，loader是个函数，接收处理前的`content`，返回处理后的`content`。

### 同步/异步loader

其中，由于loader中，会对所有的匹配到的文件进行处理，这将导致构建时间过长，于是loader具有异步类型的loader于同步类型的loader，这取决于你如何去将处理完的数据返回出去。

**同步**

```javascript
module.exports = function(content, map, meta) {
  return someSyncOperation(content);
};
// or
module.exports = function(content, map, meta) {
  this.callback(null, someSyncOperation(content), map, meta);
  return; // 当调用 callback() 时总是返回 undefined
};
```

**异步**

```javascript
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
// or
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result, sourceMaps, meta) {
    if (err) return callback(err);
    callback(null, result, sourceMaps, meta);
  });
};
```

### Raw

默认情况下，loader接收到的`content`为webpack将其转为`utf-8`的结构，我们可以设置`content`为原始的Buffer

```javascript
module.exports = function(content) {
    assert(content instanceof Buffer);
    return someSyncOperation(content);
    // 返回值也可以是一个 `Buffer`
    // 即使不是 raw loader 也没问题
};
module.exports.raw = true;
```

### Pitching 

正常情况下，loader会由后往前执行，但在这之前，loader会先由前往后执行每个loader的pitch方法

```diff
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

首先，传递给 `pitch` 方法的 `data`，在执行阶段也会暴露在 `this.data` 之下，并且可以用于在循环时，捕获和共享前面的信息。

```javascript
module.exports = function(content) {
    return someSyncOperation(content, this.data.value);
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    data.value = 42;
};
```

假设某个loader的pitch存在返回值，那么整个loader的`处理链`会**立即掉头**。

```diff
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution
```

### this

loader 内可以使用 `this` 可以访问的一些方法或属性。

**this.version**

获取`loader API`的版本号。

**this.context**

获取当前解析资源所在的路径

**this.request**

获取当前模块被引用的时候的`url`

**this.query**

获取当前loader所配置的options（webpack.config.js）

**this.callback**

用于返回loader处理结果的函数

```typescript
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

1. 第一个参数必须是 `Error` 或者 `null`
2. 第二个参数是一个 `string` 或者 [`Buffer`](https://nodejs.org/api/buffer.html)。
3. 可选的：第三个参数必须是一个可以被[这个模块](https://github.com/mozilla/source-map)解析的 source map。
4. 可选的：第四个选项，会被 webpack 忽略，可以是任何东西（例如一些元数据）。

**this.async**

意味着该loader将会是一个异步loader,返回this.callback

**this.data**

在pitch阶段和正常阶段loader共享的数据对象。

**this.cacheable**

设置是否可缓存标志的函数

```typescript
this.cacheable(flag = true: boolean)
```

默认情况下，loader 的处理结果会被标记为可缓存。调用这个方法然后传入 `false`，可以关闭 loader 的缓存。

一个可缓存的 loader 在输入和相关依赖没有变化时，必须返回相同的结果。这意味着 loader 除了 `this.addDependency` 里指定的以外，不应该有其它任何外部依赖。

**this.loaders**

当前解析模块所有匹配到的 loader 组成的数组。它在 pitch 阶段的时候是可以写入的。

```javascript
this.loaders = [{request: string, path: string, query: string, module: function}]
```

**this.loaderIndex**

当前loader所在loaders的数组下标，注意loaders中顺序为正序。

**this.resourcePath this.resource**

表示当前处理模块所被请求的url，其中`resourcePath `，不包括`query`参数

**this.resourceQuery**

返回当前模块被请求的query: `?xx=xx`

**this.target**

编译的目标，用户在`webpack.config.js`配置选项`target`中定义的

**this.sourceMap**

是否生成sourceMap

**this.emitWarning(Error) this.emitError(Error)**

发射一个警告或错误

[更多API访问](https://www.webpackjs.com/api/loaders/#loader-上下文)



## plugin

插件可以将处理函数注册到编译过程中不同时间节点上，通过Webpack暴露出来的生命周期钩子。

插件是 webpack 生态系统的重要组成部分，为社区用户提供了一种强大方式来直接触及 webpack 的编译过程(compilation process)。插件能够 [钩入(hook)](https://www.webpackjs.com/api/compiler-hooks/#hooks) 到在每个编译(compilation)中触发的所有关键事件。在编译的每一步，插件都具备完全访问 `compiler` 对象的能力，如果情况合适，还可以访问当前 `compilation` 对象。



### Tapable

tapable 这个小型 library 是 webpack 的一个核心工具，主要围绕**发布订阅模式**，但也可用于其他地方，以提供类似的插件接口。webpack 中许多对象扩展自 `Tapable` 类。这个类暴露 `tap`, `tapAsync` 和 `tapPromise` 方法，可以使用这些方法，注入自定义的构建步骤，这些步骤将在整个编译过程中不同时机触发。

请查看 [文档](https://github.com/webpack/tapable) 了解更多信息。理解三种 `tap` 方法以及提供这些方法的钩子至关重要。要注意到，扩展自 `Tapable` 的对象（例如 compiler 对象）、它们提供的钩子和每个钩子的类型（例如 `SyncHook`）。



### 组成

- 一个JavaScript命名函数或者一个类
- 在插件函数的prototype上定义一个apply方法
- 指定一个绑定到webpack自身的事件钩子
- 处理webpack内部实例的特定数据
- 功能完成后调用webpack提供的回调

```javascript
// A JavaScript class.
class MyExampleWebpackPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync(
      'MyExampleWebpackPlugin',
      (compilation, callback) => {
        console.log('This is an example plugin!');
        console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

        // Manipulate the build using the plugin API provided by webpack
        compilation.addModule(/* ... */);

        callback();
      }
    );
  }
}
```



### Hook

`webpack4`提供了大量的`compiler`以及`compilation`生命周期钩子，具体详细查看Webpack官方文档。

[compiler-hooks](https://webpack.js.org/api/compiler-hooks/)

[compilation-hooks](https://webpack.js.org/api/compilation-hooks/)



### compiler与compilation

- compiler针对的是webpack环境
- compilation针对的是随机可变的项目文件，只要文件有改变，compilation就会重新创建



### html-webpack-plugin

实现一个类似`html-webpack-plugin` 插件，实现简易的两个功能：

1. copy指定的`html`模板到输出文件夹中
2. 插入`script`标签，引入`bundle`

```javascript
const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
class HtmlPlugin {
  constructor(option){
    this.option = option
  }

  apply(compiler){
    compiler.hooks.afterEmit.tapAsync(
      'HtmlPlugin',
      (compilation, callback)=>{
        // 获取依赖文件名
        const dependence = compilation.outputOptions.filename
        // 获取输出的文件夹
        const outPutDir = compilation.outputOptions.path
        // 获取模板html
        const htmlStr = fs.readFileSync(this.option.template, 'utf-8')
        // 插入script
        const $ = cheerio.load(htmlStr, {decodeEntities: false})
        $('body').append(`<script src='${'./' + dependence}'></script>`)
        // html输出
        fs.writeFileSync(path.resolve(outPutDir, this.option.filename), $.html())
        callback()
      }
    )
  }
}

module.exports = HtmlPlugin
```

**这里依赖到了cheerio帮助我们在html字符串上进行dom操作**