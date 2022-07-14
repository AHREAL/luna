---
title: Node项目部署TypeScript
date: 2020-05-29 13:23:06
updated: 2020-05-29 14:00:16
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/nodets.png 
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/nodets.png 
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

以express-generator创建的项目为例， 从0到1的搭建。

## 开始准备

**环境**

- express 4.16
- typescript 3.9
- node 10.16

## 创建express项目

使用**express-generator** 进行快速搭建

**下载**

```shell
npm i express-generator -g
```

**创建**

```shell
express my-project
```

**查看**

```shell
cd my-project
```

**下载依赖**

```shell
npm install
```

**跑一下**

```shell
npm run start
```

浏览器打开: `http://localhost:3000/`

讲道理， 应该到达这里了。

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1590052837936_0.8138.png)

## 安装TypeScript

看你习惯**全局安装** or **局部安装**，影响不是特别大。

这里我习惯局部安装。

**下载**

```shell
npm install typescript
```

**随意书写一些ts代码，测试一下是否可以成功编译**

```shell
npx tsc test.ts
```

讲道理都是可以的😀， 测试通过记得删除测试文件



**初始化ts配置文件**

```shell
npx tsc --init
```

你会获得一个`tsconfig.json`的配置文件


## 项目结构修改

我习惯将需要进行编译的文件，全部放进项目的src目录下，这样子的结构在一定程度上更易于管理。

目前你的项目结构是这样的：

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1590052888885_0.3101.png)

**创建一个src目录，以及dist目录**

```shell
mkdir src
mkdir dist
```

**将业务代码放dist目录**

目前是 `app.js`, `routes`。

当然以后你可能会有 `utils`, `middleward`, `model`等许多不同业务代码，都需要放进`src目录` 

**完成大概是这样**

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1590052901944_0.1321.png)

**将src下的所有js后缀修改成ts**

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1590052917417_0.1168.png)

**这会你会得到许多报错， 因为项目中还未下载类型声明文件**



## 类型声明文件

 `npm install @types/包名-D`

**node类型声明**

```shell
npm install @types/node -D
```

**express类型声明**

```shell
npm install @types/express -D
```

这就不过多赘述了， 缺啥就下载啥就行了



## 修改导入，导出方式

TS导入导出推荐使用ES6的导入导出规范。

将所有`var xx = require('xx')` 修改成 `import xx from 'xx'`

就像这样：

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1590052939060_0.1830.png)

将所有 `module.exports = xx` 修改成 `export default xx`

**app.ts的导出形式就别修改了, 依旧使用module.exports， 否则需要一起修改www的导入方式。**



## 配置tsconfig

我们修改了项目结构，我们需要配置`outDir`， `rootDir` 

```json
"outDir": "dist/",                       
"rootDir": "src/"
```



## 修改www文件

我们移动了app.js的位置， 所以我们需要修改一下。

```javascript
//var app = require('../app');

var app = require('./dist/app')
```



## 修改npm脚本指令

```json
"scripts": {
    "start": "npm run build && node ./bin/www",
    "build": "npx tsc -p tsconfig.json"
}
```

​	

**npx run start 👌**