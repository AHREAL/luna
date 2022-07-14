---
title: 简易React脚手架工具
date: 2019-09-21 18:01:01
updated: 2019-09-21 19:42:11
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/react-3.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/react-3.png
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

babel以及loader的配合

## My-React-Cli

自己div一个简单的react脚手架

### 核心流程

1. 初始化项目文件夹

```shell
npm init -y
```

2. 下载react 和 react-dom

```shell
npm i react react-dom -S
```

3. 下载webpack  和  webpack-cli

```shell
npm i webpack webpack-cli -D
```

4. 下载babel的loader  和  babel核心

```shell
npm i babel-loader @babel/core -D
```

5. 下载babel的react的preset

```shell
npm i @babel/preset-react -D
```

6. 创建webpack.config.js文件，对loader进行配置

```javascript
module:{
  rules:[
    {
      test:/\.js$/,
              //匹配到node_modules文件夹下面的就跳过loader的处理
      exclude:/node_modules/,
              //使用的loader
              loader:'babel-loader',
    }
  ]
}
```

7. 根目录下创建babel配置文件 .babelrc ，配置react的babel-preset

```json
{
  "presets":[
    "@babel/preset-react"
  ]
}
```

至此，react简易脚手架已经搭建完成，当然也只是实现对react的js文件进行基本编译，当然一般来说还需配置css-loader，file-loader，dev-server等等，因为这些不在react脚手架的核心里面，所以就不过多赘述。