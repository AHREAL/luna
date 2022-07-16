---
title: 基础遍历—HTTP相关
date: 2021-03-05 14:01:01
updated: 2020-03-06 20:11:11
tags: 基础遍历
categories: 基础遍历
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/http.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/http.png
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

基础遍历—HTTP相关

## Status Code

### 分类

- 1xx - 服务端收到请求
- 2xx - 请求成功
- 3xx - 服务重定向
- 4xx - 客户端错误
- 5xx - 服务端错误

### 常用的状态码

- 200 - 成功
- 301 - 永久重定向，配合Response.Headers.Location，浏览器自动跳转（浏览器下次访问该域名自动跳转）
- 302 - 临时重定向，配合Response.Headers.Location，浏览器自动跳转（浏览器下次访问该域名依旧会去请求是否跳转）
- 304 - 资源未被修改
- 404 - 资源未找到
- 403 - 没有权限
- 500 - 服务器逻辑错误
- 504 - 网关超时

## Restful API规范

### 与传统API设计的区别

传统API把每个URL当做一个功能，Restful把每个URL当做一个唯一资源

- 尽量不使用URL参数

  传统：`/api/blog?id=1`

  restful: `/api/blog/1`

### 使用Method表示意图

- get 获取数据
- post 新建数据
- patch/put 更新数据， 区分是patch是局部更新，put是全量更新
- delete 删除数据

## Headers

### 常见的Request Headers

- Accept 浏览器可接收的数据格式
- Accept-Encoding 浏览器可接收的压缩算法，如gzip
- Accept-Language 浏览器可接收的语言
- Connection: keep-alive 一次TCP连接重复使用
- cookie
- Host 本次请求的域名
- User-Agent 浏览器UA
- Content-type 发送数据的格式， 比如 application/json

### 常见的Response Headers

- Content-type 返回的数据格式，比如 application/json
- Content-length 返回数据的大小，单位字节
- Content-Encoding 返回数据的压缩算法，如gzip

## 缓存相关

### 强制缓存/协商缓存

强制缓存：服务端决定一个资源的缓存过期时间，在过期之前，浏览器只会访问本地缓存的数据。

协商缓存：服务端缓存的策略，根据资源最后更新的时间或资源内容变动来决定缓存是否可用，可用返回304，不可用返回200并带上最新的资源。

### Cache-Control 

- max-age = 518400 单位秒
- no-cache 不强制缓存
- no-store **完全**不缓存
- private 只允许用户缓存
- public 允许中间代理缓存

### Expires

- 同在Response Headers
- 同为控制缓存过期，如果同时存在Cache-Control，浏览器以Cache-Control为准
- 已被Cache-Control代替，属于比较老的标准

### Last-Modified/If-Modified-Since

- Last-Modified存在于ResponseHeaders，If-Modified-Since存在于RequestHeaders
- 表示该资源的最后修改时间

### Etag/If-None-Match

- Etag存在于ResponseHeaders，If-None-Match存在于RequestHeaders。
- 资源的唯一标识，资源发生改变，Etag也会发生改变
- 优先级大于Last-Modified，两者同时存在，以Etag为准。

### 图例

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1607269152388_0.3109.png)

### 不同刷新操作对于缓存的影响

- 正常操作：输入URL打开网页，跳转网页，前进后退
  - 强制缓存、协商缓存都生效
- 正常刷新操作：command + r 
  - 强制缓存无效，协商缓存有效
- 强制刷新操作：shift + command + r
  - 全部缓存都无效