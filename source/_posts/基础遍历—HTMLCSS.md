---
title: 基础遍历—HTML/CSS
date: 2021-03-01 18:01:01
updated: 2020-03-02 21:11:11
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/htmlcss.jpeg
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/htmlcss.jpeg
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

一些常见的HTML/CSS基础

## HTML

### 如何理解语意化

- 人阅读代码更加易懂
- 有利SEO抓取

### 默认情况下，哪些是块级元素，哪些是内联元素

- display:block/table: div h1 h2 table ul ol p等

- display:inline/inline-block: span img input button等

## CSS

### 盒子模型宽度如何计算

### offsetWidth, clientWidth, scrollWidth 区别

- offset: border + padding + width

  ![image20201127235018051.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1606646591922_0.8392.png)

- client: padding + width 
  ![image20201127235031824.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1606646602367_0.3507.png)

- scroll: padding + width + border 

  ![image20201127235207319.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1606646613031_0.2472.png)

  以上是W3C标准的解释，各大浏览器厂商对其理解稍有偏差。

### margin纵向重叠问题

- 相邻元素的marginTop与marginBottom存在重叠（取最大值）

### margin负值的效果

- 主要注意，方向不同（上下左右），效果是不同的。

  - 上和左
    - 自身元素向上和左移动
  - 下和右
    - 文档流中，自身元素下方和右方的元素被“吸”，往设置的反方向移动，更加准确的来说，是外部的元素认为你减少了文档流所占距离。

  所以在开发中避免混淆，我习惯只使用margin-top以及margin-left

### BFC理解和应用

- BFC全称为 **Block format context**，块级格式化上下文。
- BFC是指一类元素的CSS样式类型。
- 一个BFC的元素，内部渲染不会影响边界以外的元素（容器内部的元素不会超出容器边界，不会影响容器外部）。
- 形成BFC元素的常见条件：
  - float不是none
  - position是absolute或者fixed
  - overflow不是visible
  - display是flex inline-block等
- BFC的常见应用
  - 浮动清除

### float布局

#### 如何实现圣杯布局和双飞翼布局

- 垂直三栏布局，中间一栏（放置重要内容）最先加载和渲染(中间栏放在HTML文档中最前)。
- 两侧内容固定，中间内容随着屏幕宽度自适应。
- 一般用于传统的PC网页。
  - 实现：
    - 使用float布局
    - 两次使用margin负值，以便中间内容横向重叠
    - 防止中间内容被两侧覆盖，一个用padding，一个用margin
- 两种布局方式有什么区别
  - 解决的问题一样，三栏布局，实现方式不同。
  - 防止中间内容被两侧覆盖，一个用padding，一个用margin

#### clearfix类怎么写，zoom是做什么的？

当一个元素的子元素都是设置了float属性，那么元素的高度不会被撑开，我们可以使用clear来清除浮动。

```css
.clearfix::after{
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.clearfix{
	/* 兼容低版本的IE浏览器 */ 
  *zoom:1;
}
```

在因为浮动导致高度没有撑开的容器上添加这个类。

### flex布局

#### 常用语法

- flex-direction
- justify-content
- align-items
- flex-wrap
- align-self 
  - 自身在交叉轴(副轴)上的对其方式：flex-start, center, flex-end

### 定位相关

#### relative和absolute定位

- relative依据自身当前所在文档流位置进行定位
- absolute依据最近一层的父定位元素进行定位

#### 居中对齐的方式

##### 水平居中

- inline元素，可以使用text-aligin: center
- block元素，margin:auto
- absoulte元素， left: 50% + margin-left负自身50宽度

##### 垂直居中

- inline元素，设置容器行高等于自身高度
- absoulte元素，top:50% + margin-top负自身50高度
- absoulte元素，transform(-50%, -50%)
- absoulte元素，top,left,bottom,right = 0 + margin： auto

### 图文相关

#### line-height如何继承

继承最近一层的父元素。

在父元素设置百分比line-height的时候，line-height并不会直接继承，而是在父元素计算后再继承。

### 响应式

#### rem

相对根元素(html)的font-size。

#### em

相对父元素的font-size。

#### vw/vh/vmax/vmin

- 1vw 视口宽度1%
- 1vh 视口高度1%
- 1vmax 视口高度/宽度取两者较大值为基准的1%
- 1vmin 视口高度/宽度取两者较小值为基准的1%

#### 响应式布局原理

通过媒体查询，实现在不同宽度设备下的不同css样式。

常与rem进行配合，通过媒体查询，动态修改根元素的font-size来保证不同宽度设备下的显示比例一致。

#### 设备高度

- window.screen.height
  - 设备屏幕的高度，包括网页内容以外的东西（地址栏，状态栏）
- widnow.innerHeight
  - 网页的视口高度
- document.body.clientHeight
  - body元素的高度