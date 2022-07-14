---
title: Flow
date: 2020-05-03 12:00:02
updated: 2020-05-04 12:32:31
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/flow.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/flow.png
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

如何安装以及Flow的基本使用

## 简介

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589387280014_0.4220.png)

**Flow is a static type checker for JavaScript**

https://flow.org/en/

FaceBook开源的Javascript静态类型检查工具。

Flow 是一个Javascript静态类型检查工具， 让你开发更加快速，智能，可靠，项目更加大型。

他通过 **static type annotations** 对代码进行类型检查，你可以声明类型来来告诉Flow你的代码将如何进行工作，Flow会确保你的代码照着你规定的方式去运行。



## 第一个例子

在Flow中可以通过冒号的形式去规定变量的类型，在函数的参数括号后面规定函数的返回值类型

```javascript
// @flow
function square(n: number): number { 
  return n * n;
}

square("2"); // Error!
```



## 使用Flow

**安装**

```shell
npm i flow-bin -D
```

**初始化flow配置文件**

```shell
npx flow init
```

**头部添加**

在需要进行类型检查的js文件头部添加

```javascript
// @flow
```

如果少了这个头部注释，则flow不会对文件进行类型检查。

**我们有两种方式声明变量类型**

1. 注释
2. 直接改写

**注释**

```javascript
var a /*: number*/ = 10;
```

**直接改写（推荐）**

```javascript
var a:number = 10;
```

如果直接改写js代码结构，则代码无法直接运行了，这时候便需要使用 **babel进行代码转换**

**执行检查**

```shell
npx flow 
```



## 配合Babel

通过上述第二种方式去使用FLow（直接改写），会导致js文件无法运行，这时候可以借助Babel对Js进行转码。

**安装**

```shell
npm i babel-cli babel-preset-flow -D
```

**创建.babelrc**

```json
{
	"presets":["flow"]
}
```

**运行**

```shell
npx babel ./src -d ./dist
```



这时候就可以看到，src目录下的flow代码已经被编译到dist目录下，并且可以顺利运行了。



## Flow中的数据类型
![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589387717500_0.0674.png)

## 元素类型

比如说Array数据类型较为特殊， 需要使用 <> 来声明数组中元素的类型

```javascript
// @flow

let arr: Array<number> = [1, 2, 3, 4]

let arr2: Array<number> = [1, 2, 3, '4']  //error

let arr3: Array<any> = [1, 2, 3, '4']
```



## 处理类型错误

有了Flow以后， 我们可以十分方便的去规定数据的类型，之前我们没有Flow的情况下， 很多时候我们经常不知道我们什么时候应该进行类型判断，即使进行类型判断， 也十分的复杂和不便。

**无Flow**

```javascript
const count = (arr) => {
    if(!arr){
        throw new Error('参数不存在') 
    }
    
    if(!Array.isArray(arr)){
        thorw new Error('参数必须为一个数组')
    }
    
    if(!arr.every(item=>typeof item === 'number')){
        throw new Error('数组的元素必须为数字类型')
    }
    // 前面的代码都是用来判断类型， 而真正的业务代码只有三行
    
    let sum
    arr.forEach(item=> sum+=item)
    return sum
}
```

**使用Flow**

```javascript
// @flow

const count = (arr: Array<number>): number => {
    // 类型事先声明， 则无需再进行类型判断， 代码简洁了许多
    let sum: number = 0
    arr.forEach(item=> sum+=item)
    return sum
}
```



## 函数类型

Flow允许我们指定函数参数为函数的参数类型以及函数的返回值类型。

听着有点绕😜

假设我们定义了一个方法， 这个方法接收一个参数用作回调函数，我们可以规定这个回调函数的参数类型以及返回值类型。

这儿有个例子，假设我们定义一个**sqlExec**方法， 函数接收两个参数， 一个是sql语句， 一个是回调函数用于接收sql查询的结果。

**无Flow**

```javascript
const sqlExec = async (sql, callBack) => {
	const data = await query(sql)
    callBack(data)
}
```

**使用Flow**

```javascript
//@flow

const sqlExec = async (sql: string, callBack: (data: Object) => void):void => {
    // 我们可以对CallBack的参数以及返回值进行类型检查
    
	const data = await query(sql)
    callBack(data)
}
```



## Maybe类型

我们有时候需要实现函数的重载，在不使用**Maybe**类型时

```javascript
//@flow

// 我们规定这个函数num默认值为1（如果调用者没有传递参数）
const fn = (num:number):number => {
    num = num || 1
    return num
}

fn() // error， 我们无法将undefined作为参数传递给fn
```

我们可以使用**Maybe**， 方式也很轻松， 加个问好

```javascript
//@flow

// 我们规定这个函数num默认值为1（如果调用者没有传递参数）
const fn = (num:?number):number => {
    num = num || 1
    return num
}

fn() // 1
```

**Maybe**允许参数类型是规定好的(比如例子中是**number**)，或者是**undefined**，或者是**Null**



## 或操作

当一个变量具有多种允许的类型时， 我们可以使用 | 连接

```javascript
//@flow

let age: number|string = 10;

age = "10";
```



## 类型推断

在某些情况下我们没有声明完整类型，**Flow** 能够在一定程度上帮助我们进行类型的推断。

```javascript
//@flow

// 我们没有声明fn返回值类型， 但是flow帮助我们推断出fn返回值类型为number
const fn = (a:number, b:number) => {
    return a+b
}

// 我们将fn返回值赋值给c，c声明类型却为string。
const c:string = fn(1,2); //error
```



## 对象类型

我们可以直接使用对象的花括号写法， 对对象的属性类型进行声明。

```javascript
//@flow

// 假设我们存在一个ajax方法， ajax接收一个options，options需要有url, method, success回调
const ajax = (options: {url: string, method: string, success: (data:Object)=>void}) => {
    
}

ajax() 
// error, 无法传递undefined个月ajax方法

ajax({  
    url:'xxx'
})
//error, method missing, success missing

ajax({
    url:'xxx',
    method:'GET',
    success:(data)=>{
        
    }
})
// no errors
```