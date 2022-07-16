---
title: Webpack基本概念
date: 2020-04-15 14:12:52
updated: 2020-04-15 18:56:23
tags: Webpack
categories: 前端工程化
keywords:
description: Webpack基本概念
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

打包工具的特点以及优势

## Webpack

webpack主要的目的是 **实现模块化开发**，并且帮我们做一些上线代码繁琐工作，比如说压缩代码，混淆变量名，实现模块引入等等。

Webpack是node.js的一个应用，所以Webpack的使用依赖node.js（node.js请先自行安装）



## 什么是webpack

首先你要明白webpack是什么？见名知其意，web：网页，和浏览器有关；pack：包裹，包装。

完整读起来便是网页端包装，主要用于web前端的打包工具。

上面说到，webpack主要实现模块化开发，要知道，浏览器是不支持我们在js文件里面引入别的js文件，如果我们需要引入很多的js文件，那么我们需要写非常多的script标签，这是非常不好的，这些script里面如果存在依赖关系，那么我们还得注意他们引入的先后顺序等等一些麻烦的问题。



## 为什么使用webpack

有的同学可能会问：

```
我写项目也没多少script标签啊，我干嘛还要打包呢？我一个一个引入不就好了。
```

是这样的，在开发中，你不可能说你不使用一些开源的包，我们经常为了解决需求，到GitHub上面找并且使用别人开源出来的一些代码，如果你使用script标签引入，项目一大，script标签就会变得非常多。

有的同学可能还会觉得：

```
我不怕麻烦，我就在需要的时候写个script标签就好了！
```

那我再给你一个理由，举个栗子🌰：

比如说你在GitHub上面拉一个日期选择器，这个日期选择器其实是依赖jQuery进行开发的，作者为了保证可用性，直接将jQuery和日期选择器的源码一起打包进一个js文件供人直接script标签引入使用。

如果你这时候还拉了另外一个作者写的一个地区选择器，插件同样依赖jQuery并且作者同样将JQuery一起打包进一个js文件，你又直接引入了，那么你的script标签就是：

```html
<script src=".../datepicker"></script>
<script src=".../regionpicker"></script>
```

看起来貌似没什么问题，很多人也觉得这没毛病，但是你将其转换成内联script标签。

```html
<script>
    //jQuery依赖
	function jQuery(){
    	...
    }
    //日期选择器源码
    function datepicker(){
    	...
    }
</script>
<script>
    //jQuery依赖
	function jQuery(){
    	...
    }
    //地区选择器源码
    function regionpicker(){
    	...
    }
</script>
```

你应该发现问题了，你项目中明明只需要一个jQuery，但是却引入了两个jQuery，是不是就造成了资源上的浪费，影响了性能呢？如果你使用webpack，那么将不存在这个问题。

所以说到这，我想你应该有足够的理由学习使用webpack了！