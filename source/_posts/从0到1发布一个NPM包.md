---
title: 从0到1发布一个NPM包
date: 2020-05-12 20:58:01
updated: 2020-05-12 21:00:01
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/npm.jpeg
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/npm.jpeg
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

记一次实验性操作流程。

## 前言

NPM已成为开发者日常不可缺少的一个工具，经常性的需要到NPM上寻找工具来解决业务需求。

随着开发经验的积累，我们逐渐会总结和归纳出一些自己写的库提高开发的效率。

常常我们是将其置于本地独乐乐🙃。

本文会记录如何发布一个NPM包，顺带讲一些TypeScript的基础。

## 需求

我们封装一个对象排序的方法`mapSort`。

我们希望能够对`Object[]`进行排序，根据Object上的`index`字段。

假设：我们有一组这样的数据

```javascript
const arr = [
  {
    name:'allen',
    index:18
  },
  {
    name:'ahreal',
    index:19
  },
  {
    name:'tom',
    index:16
  }
]
```

我们希望调用`mapSort`方法得到

```javascript
const _arr = mapSort(arr, true)

// 得到
// [
//   {
//     name:'tom',
//     index:16
//   },
//   {
//     name:'allen',
//     index:18
//   },
//   {
//     name:'ahreal',
//     index:19
//   }
// ]
```



## mapSort

我们希望mapSort接收两个参数，`数组`，`是否采用倒序排列`



## 初始化

创建一个文件夹`map-sort-test`

**npm初始化**

需要先去npm上面搜索一下是否存在同名包

```shell
npm init

package name: (mapsort) map-sort-test
version: (1.0.0)
description: map sort
entry point: (index.js) ./dist/index.js
test command:
git repository:
keywords: map,sort,study
author: allen<ahreal@foxmail.com>
license: (ISC)
```

**安装typescript**

```shell
npm instaill typescript -D
```

**初始化typescript**

```shell
npx tsc --init
```

**配置tsconfig.json**

`declaration`配置为true，ts会帮助我们自动生成`.d.ts`文件，方便他人引用的时候能获得ts类型提示。

```json
{
  "compilerOptions": {
    "target": "es3",                    
    "module": "commonjs",                  
    "declaration": true,                 
    "outDir": "./dist",                      
    "rootDir": "./src",                  
    "removeComments": true,               
    "strict": true,                          
    "esModuleInterop": true,                 
    "skipLibCheck": true,                   
    "forceConsistentCasingInFileNames": true
  }
}
```

**配置package.json脚本**

```json
"scripts": {
    "build": "npx tsc -p ./tsconfig.json"
},
```



## 开发

创建src目录，创建index.ts。

```typescript
const mapSort = (arr, isDesc) => {
  const len = arr.length;
  for (var i = 0; i < len - 1; i++) {
    let minIndex = i;
    for (var j = i + 1; j < len; j++) {
      if (arr[j].index < arr[minIndex].index && !isDesc) {
        minIndex = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}

export default mapSort
```

我们为代码加上ts类型的限制。

```typescript
const mapSort = (arr: {readonly index: number}[],isDesc?: boolean) => {
  const len = arr.length;
  for (var i = 0; i < len - 1; i++) {
    let minIndex = i;
    for (var j = i + 1; j < len; j++) {
      if (arr[j].index < arr[minIndex].index && !isDesc) {
        minIndex = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}

export default mapSort
```

这里要注意一下， 你如何导出你的包关乎到别人如何引入你的包，比如说这里我使用了ES6的`export default` ，那么别人在使用你的包的时候只能够 `import xx from xx`。

差不多就是这样了，打包到dist目录。

```shell
npm run build
```

于是我们在dist得到两个文件 `index.js` 与 `index.d.ts`



## 账户准备

我们需要准备一个NPM账户，到官网注册一个（记得注册完要去验证一下邮箱，注意查看邮箱）。

有了npm账户以后

```shell
npm login
```

输入用户名密码，登录成功以后，直接

```shell
npm publish
```

恭喜你🎉，你已经发布成功，并且可以正常的下载使用了。

**记得以后每次更新的时候，需要修改一下package.json的版本号**