---
title: 记一次hexo搭建
date: 2022-07-15 16:57:01
updated: 2022-07-15 16:57:01
tags: 杂记
categories: 杂记
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/hexo.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/hexo.png
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


## 前言

<img src="https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/hexo.png" style="zoom:50%;" />

**hexo**也算是老牌博客框架了，以前对于hexo的了解也仅仅停留在知道他是一个能够快速将本地的markdown文件生成静态网站的框架。
最早的个人博客网站还是自己动手，从0-1的一个spa，并做了大量seo，设备适配，性能优化，配套开发的服务也包括后台管理系统，node服务以及sql数据库，当然个人还兼备产品设计，UI设计等工作。

入坑尝试hexo是由于看到hexo：

1. 主题丰富，且多端适配良好。
2. seo优化，网页性能👍🏻。
3. 方便管理，迁移。



## 安装

准备好基本环境：

1. git
2. node

直接全局安装hexo-cli

```shell
npm install -g hexo-cli
```

运行检查是否安装完成

```shell
hexo version
```



## 初始化项目

使用hero-cli初始化blog项目，我取名叫"luna"吧🌛。

```shell
hexo init luna
```

接着安装依赖

```shell
cd luna
npm install
```

安装完成之后，我们可以运行看下效果。

```shell
hexo s
```

打开`http://localhost:4000/`查看效果

![image-20220703154230288](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/image-20220703154230288.png)



**文章迁移**

把原先写过的markdown，copy到source/_posts。

```shell
cp -r /Users/allen/Documents/blog /User/allen/Desktop/luna/source/_posts
```

> 这里我没找到如何快速批量配置front-matter的方式，只能手动一个一个改了



## 配置_config.yml

Yaml语言的配置文件，对网站进行详细的设置。

https://hexo.io/docs/configuration.html



## 安装主题

默认的主题有点丑，可以到官网找下喜欢的。

https://hexo.io/themes/

我选了Butterfly
https://butterfly.js.org/

按照提示安装配置即可。

