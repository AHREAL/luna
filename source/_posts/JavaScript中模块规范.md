---
title: JavaScript中模块规范
date: 2020-05-21 14:12:36
updated: 2020-05-22 19:09:08
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/jsmodule.jpeg
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/jsmodule.jpeg
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

总结了一下CommonJs，AMD，ESModule等常用规范。

## 前言

今天来系统的总结一下各大模块化规范之间的特点。

其实在JS中，模块化这个概念原本是**不存在**的，JS的出现的初衷只是解决细小的浏览器用户交互需求而产生的。

所以以前的js文件的执行环境是没有通过文件进行作用域隔离这个概念，顶多也就是闭包间的使用。

而到了Node.Js出现的时候，Node.js实现了`CommonJs`规范，实现了通过`module.exports`,`require`等关键字进行模块的加载以及暴露。

## CommonJs

由NodeJs实现的一套模块导入导出的方式。

- 通过`require`以及`module.exports`进行模块的加载以及暴露。
- 文件之间都是单例的，即使文件被导入了多次，代码并不会被执行多次，而是去缓存中读取模块的暴露结果。

**单例模块**

假设我们有这个三个js文件，`index.js`,`moduleA.js`,`moduleB.js`

**index.js**

```javascript
require('./moduleB')

const randomNum = require('./moduleA')

console.log(randomNum)
```

**moduleA.js**

```javascript
const randomNum = Math.random()

module.exports = randomNum
```

**moduleB.js**

```javascript
const randomNum = require('./moduleA')

console.log(randomNum)
```

**执行**

```shell
$ node index.js
0.25811159045824716
0.25811159045824716
```

输出的`randomNum`是相同的，证明在`moduleA`中，`Math.random()`只会执行一次，并将结果暴露出去。

## AMD

AMD规范常作用于浏览器，全称 **Asynchronous module definition** ，异步的模块定义。

由于浏览器中为了避免模块的加载，导致的客户端等待响应时间过长，所以AMD规范的模块全部都是异步加载。

在浏览器环境下，实现AMD规范我们还需要借助`requre.js`这个库帮助我们声明AMD规范中使用到的关键字。

**require.js**

```html
<script src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.min.js"></script>
```

**AMD与CommonJS一致，都是单例模式。**

**index.js**

```javascript
require(['moduleA', 'moduleB'], (moduleA,moduleB)=>{
  console.log('我是index', moduleA)
})
```

**moduleA.js**

```javascript
define(function() {
  return Math.random()
});
```

**moduleB.js**

```javascript
define(function(require) {
  const randomNum = require('moduleA')
  console.log('我是moduleB',randomNum)
});
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.min.js"></script>
  <script src="./index.js"></script>
</body>
</html>
```

观察控制台可见，输出的随机数永远都是保持一致，且以异步的形式去加载。

```diff
我是moduleB 0.36362062324683464
我是index 0.36362062324683464
```



## CommonJS与AMD

- 都是在语言的上层定义的模块化方案，模块化由环境决定。
- 相互之间不可直接公用，例如不能再Node.js运行AMD模块，不能直接在浏览器运行CommonJS模块。



## ESModule

在**ES2015**中，定义了模块化的规范称为**ESModule**。

这是Javascript首次拥有了语言层面上的模块化规范，用于打通在不同运行环境下的模块兼容问题。

JavaScript代码归根到底，是一串又一串无意义的字符串，我们通过遵守 **ECMAScript** 规范，写JavaScript代码， 

而JavaScript的运行环境开发者，也依照 **ECMAScript** 规范来设计运行时，解读我们的所写的代码，那么最终代码才是一串有意义的字符串。 

现在ESModule规范出来，各大运行环境（比如浏览器，node，小程序等）只需对其自家的模块解析引擎升级一下，最终都会支持ESModule规范。

例如在**node.js v13.2.0** 以及**chrome 76**中，已经直接支持了ESmodule规范

**node.js**

如果需要直接使用ESModule，则需要将`js`后缀修改成`mjs`。

```javascript
// index.mjs
import moduleA from './moduleA.mjs'

console.log(moduleA.name)

// moduleA.mjs
export default {
  name:'ahreal'
}
```

**chrome**

在chrome中，如果需要使用ESmodule，则需要在script标签的`type`设置为`module`

```html
<script type="module" src="index.js"></script>
```

接下来ESModule便畅通无阻。