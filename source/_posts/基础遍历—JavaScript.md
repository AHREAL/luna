---
title: 基础遍历—JavaScript
date: 2021-03-04 19:01:01
updated: 2020-03-07 23:29:55
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/js.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/js.png
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

温习路线，涉及ECMA，W3C标准的相关重点。

## 类型相关

### typeof 能判断的类型

- 所有基本类型
  - number
  - string
  - boolean
  - symbol
  - bigint
  - undefined
- 引用类型
  - object

- 函数类型
  - function

### === 和 == 区别

- == 会对两边的值进行强制类型转换，比如字符串和数字对比，会将数字转换成字符串再进行对比。
- === 则不会进行类型转换。

## 深拷贝

简单例子：没有对正则等一些复杂对象进行特殊处理

```javascript
const deepClone = (obj = {}) => {
  if(typeof obj !== 'object' || obj == null) {
    return obj
  }
  
  let result
  if(obj instanceof Array){
    result = []
  }else{
    result = {}
  }
  
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      result[key] = deepClone(obj[key])
    }
  }
  
  return result
}
```

## && 运算规则

- 如果左侧是falsely类型，则返回左侧，否则返回右侧

## 原型与原型链

### class

实际上是语法糖

- constructor
  - 构造函数
- 属性
- 方法
- extends
  - 继承

### instanceof

- 判断一个**对象**是否属于某个原型构造结果或者说处于某个原型的原型子链上
- 只能用于判断引用类型，**不能判断**基本类型

### prototype 与 __ proto __

在V8引擎下，使用prototype以及__ proto __实现原型模式

- prototype 显式原型
- __ proto __ 隐式原型

### 基本原型链图

翻出了压箱底早期学习时画的一张原型链图(v8引擎下的实现)

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1607250483413_0.4068.png)

可以映射到许多系统内置的原型如**Array**等。

### 基于原型链模型的查找规则

1. 调用对象的方法
2. 查找对象自身
3. 查找对象的隐式原型链上的所有原型，就近原则

### 原型模型上的插件与扩展性

原型模型一大好处就是易于扩展

```javascript
import vue from 'vue'

// 直接往vue的原型对象上添加自己的方法
vue.prototype.getTime = () => { ... }

// 直接在vue基础上二次开发
class newMoment extends vue {
  constructor(){
    super(...arguments)
  }
  
  getTime(){
    ...
  }
}
```

## 作用域相关

作用域表示一个变量的合法使用范围。

### 作用域类型

- 全局作用域
- 函数作用域
- 块级作用域（ES6）
  - 花括号内的let,const变量在花括号(if, while, for)之外无法访问

### 自由变量

没有在当前作用域定义，但是使用了的变量。

在访问的时候会沿着作用域链向上级依次寻找。

### 闭包

函数在作用域A定义，在作用域B执行的函数。

一个**不在定义的作用域**执行的函数，称之为闭包函数。

```javascript
/*   DEMO1    */
function fn(){
  const a = 100
  return function(){
    console.log(a)
  }
}

const myFn = fn()
const a = 200
myFn() // 100

/*   DEMO2    */
function fn2(fn){
  const a = 200
  fn()
}

const a = 100
function fn3(){
  console.log(a)
}

fn2(fn3) // 100
```

**所有自由变量的查找，都是在函数定义的地方查找。**

### this

**this取什么值，是在函数执行的时候决定的，不是在函数定义的时候决定的。**

- 普通函数被执行 -> window
- 类方法被执行 -> 类的实例对象
- 定时器的回调被执行（普通函数） -> **window**
  - 定时器较为特殊，定时器传参函数是在合适的时机被window调用，所以this是window
- 定时器的回调被执行（箭头函数） -> 回调函数所在作用域链上最近的this
  - 箭头函数的this用于取决于其所定义的位置
- call/apply/bind 改变this指向（对箭头函数无效，因为箭头函数的this无法被修改，箭头函数的this永远取决于**执行时**上级的this）



### 写一个bind函数

```javascript
Function.prototype.myBind = function(){
  // 参数第一项为新的this
  const _this = arguments[0]
  // 函数调用者为目标函数
  const fn = this
  // 函数除了第一项剩余的参数
  const arg = Array.prototype.splice.call(arguments, 1, arguments.length)
  return fn.apply(_this, arg)
}
```



### 闭包引用场景

- 隐藏一些内部变量，防止变量名冲突
- webpack打包模块就是用的闭包原理



## 异步编程

### 单线程

- JS是单线程语言
- 浏览器和nodejs已经支持启动多线程，比如web worker
- js和dom渲染公用一个线程，因为js可以修改dom结构

### Promise

- new Promise 返回一个 promise对象

- **promise链式调用**

  ```javascript
  promise.then(fn).then(fn)
  ```

  then方法接受一个callBack作为参数，返回一个promise对象（不返回promise怎么继续then）。

  其中，callBack的返回值会作为下一次then的callBack的执行参数。

### Promise状态以及变化

#### 对象的三种状态

- pending 
- fulfilled
- rejected

**状态变化不可逆 (pending -> fulfilled 或者 pending -> rejected)**

**但 fulfilled 与 rejected 可互相切换**

每个promise对象一定存在一种状态。

```javascript
new Promise() // pending
Promise.resolve() // fulfilled
Promise.reject() // rejected
```

#### resolved 与 rejected 切换

**then与catch的回调如果没有报错，则返回resolved状态的promise对象**

```javascript
Promise.resolve().then(()=>{
	throw new Error('error')
}) // fulfilled -> rejected

Promise.reject().then(()=>{}).catch(()=>{
  console.log('...')
}) // rejected -> fulfilled
```



### event loop

- 大前提：js从前到后逐行执行。
- 如果某一行代码抛出异常（未捕获），则停止下面代码的执行。
- 先把同步执行完，再执行异步。

#### 五个主要核心

1. 执行栈 stack
2. webapis
3. 回调队列 Macro task queue
4. 微任务队列 micro task queue
5. 事件轮询（循环）机制

#### 基本图例

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1607250422321_0.4973.png)

#### event loop一次周期

1. 执行完当前call stack所有代码（产生的宏任务异步放置Web APIs等待，微任务放置微任务队列尾，DOM渲染等待）
2. 清空当前微任务队列
   - 由于微任务的产生是直接放置微任务队列尾，如果在执行微任务队列时不断出现新的微任务加起来，那么程序会卡住
3. 检查是否有 dom 渲染任务在等待，如果有，渲染dom
4. 清空宏任务队列
   - 宏任务是**一个一个**清除的，执行宏任务过程中产生的微任务，会在当前宏任务执行完直接执行清空微任务。

### DOM事件与event loop

其实两者原理一样，一但事件被绑定，回调就会被挂起，等到合适的时机放入回调队列等待轮询放入执行栈。

### 宏/微任务

- 异步API的分类
  - 宏任务：宿主环境的API (W3C)
  - 微任务：Js引擎的API (ES)
- 微任务比宏任务执行的时机早。
- 微任务在DOM渲染前触发，宏任务在DOM渲染后触发。

### async/await

ES7语法糖。提供了同步的方式去进行异步编程。

- 执行async函数，返回的是promise对象
- await 相当于 then （await 如果跟的是一个变量，则直接返回变量）
- try catch 用于捕获 async 函数内部执行异常

**await 后面的函数立即执行，await 下面的代码视为异步回调。**

**DEMO: async await**

```javascript
async function async1 () {
  console.log('async1 start') // 2
  await async2() // 这里使用了 await
  console.log('async1 end') // 7
}

async function async2 () {
  console.log('async2 start') // 3
  await async3()
  console.log('async2 end') // 6
}

async function async3 () {
  console.log('async3') // 4
}

console.log('script start') //1
async1() // 由于async1调用没有使用 await，所以当async1同步代码执行完，会直接往下执行
console.log('script end') // 5
```

同样的例子，用Promise的写法体现是

```javascript
function async1 () {
  console.log('async1 start') 
  new Promise((resolve, reject)=>{
    async2()
    resolve()
  }).then(()=>{
    console.log('async1 end') 
  })
}

function async2 () {
  console.log('async2 start')
  new Promise((resolve, reject)=>{
    async3()
    resolve()
  }).then(()=>{
    console.log('async2 end') 
  })
}

function async3 () {
  console.log('async3')
}

console.log('script start') 
async1() 
console.log('script end') 
```



### 异步循环

日常开发中，发现forEach以及for..in无法对await进行等待。

**for，for..of可以等待。**

```javascript
const arr = [1, 2, 3]
const getResult = async (num) => {
  return new Promise((resolve, reject) => {
     setTimeout(()=>{
       resolve(num**2)
     }, 2000)
  })
}

// for循环
const loop = async () => {
	for (let i = 0; i < arr.length; i++){
    const res = await getResult(arr[i])
    console.log(res)
  }
}

// for...of 循环
const loop2 = async () => {
	for (let i of arr){
    const res = await getResult(i)
    console.log(res)
  }
}
```

## WebAPI

### DOM操作

- 获取DOM节点
  - 通过ID `document.getElementById`
  - 通过标签名 `document.getElementsByTagName`
  - 通过类名 `document.getElementsByClassName`
  - 通过选择器 `document.querySelectorAll`

- DOM对象的property

  本身没有property这个API，是一种形式，表示通过JS的方式去操作DOM的一些属性。

```javascript
const p = document.getElementById('p')
p.style.width = '100px'
p.style.height = '100px'
p.className = 'title'
```

- DOM对象的attribute

  真正作用到DOM的结构，DOM的行内属性。

```javascript
const p = document.getElementById('p')
p.setAttribute('class', 'title')
p.setAttribute('style', 'height=100px')
```

- 一般情况下，操作dom的attribute比property耗费性能，因为操作attribute -> dom结构变化，dom会重新渲染， 而property只有部分操作会引起dom重新渲染。

### DOM节点操作

- 新建DOM：`document.createElement`
- 插入DOM:  `element.appendChild`
- 移动DOM:  
  1. 先获取现有节点 `document.getElementById` 
  2. 插入节点 `element.appendChild`
  3. 节点会直接从原位置移动到新的位置
- 删除DOM: `element.removeChild`
- 获取父元素： `element.parentNode`
- 获取子元素列表：`element.childrenNodes` **会包含所有子元素以及文本节点**

### DOM性能相关

- DOM操作昂贵，避免频繁DOM操作
- 对DOM查询做缓存
- 合并多次DOM操作
  - 字符串拼接 -> innerHTML
  - 创建文档片段 -> 对该文档片段操作 -> 一次性插入该文档片段

```javascript
// 合并多次DOM操作
// 使用文档片段方式合并DOM操作
const frag = document.createDocumentFragment()
for(let x = 0; x<10 ; i++){
  const div = document.createElement("div")
  div.innerText = `我是第${x}个DIV`
  frag.appendChild(div)
}

document.body.appendChild(frag)
```

### BOM相关

- 识别设备类型 `window.navigator.userAgent`
- url信息对象 `window.location`
- 屏幕信息对象  `window.screen`
  - width
  - height

## 事件

- 事件绑定
  - `element.addEventListener`
  - `element.onclick`
  - 行内元素绑定 `<p onclick="alert('click')">`

- 事件冒泡
  - 事件的触发默认会冒泡
  - 阻止事件冒泡`e.stopPropagation()`
- 事件代理
  - 利用事件冒泡机制，将相似回调绑定在上级DOM，同一处理事件。
  - 可通过target.matches(selector)去区分触发的具体DOM。
  - 优势：减少DOM操作，减少监听器的创建，节约内存。

## ajax

通过`XMLHttpRequest`异步请求数据

```javascript
const ajax = (url, method, params = {}) => {
  return new Promise((resolve, reject)=>{
 		const xhr = new XMLHttpRequest()
    let _url = url 
    // 处理GET参数
    if(method === 'GET' && Object.keys().length){
      const paramsArr = []
      for (let key in params){
        paramsArr.push(`${key}=${params[key]}`)
      }
      _url += ('?' + paramsArr.join('&'))
    }
    
    xhr.open("GET", _url, true)
    // 第三个参数表示是否是异步请求
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          resolve(xhr.response)
        }else{
          reject(xhr.response)
        }
      }
    }
    xhr.send(method === 'POST' && JSON.stringify(params) : null)   
  })
}
```

- readyState
  - 0 (未初始化) 还没有调用send()方法
  - 1 (载入) 已经调用send()方法，正在发送请求
  - 2 (载入完成) send()方法执行完成，已经接收到响应内容
  - 3 (交互) 正在解析响应内容
  - 4 (完成) 响应内容解析完成，可以在客户端调用
- status
  - 对应http code
  - 2xx - 成功处理请求，如200
  - 3xx - 重定向 浏览器重跳转，如301 302 304
  - 4xx - 客户端请求错误 如404 403(没有权限)
  - 5xx - 服务端错误

### 跨域相关

- 浏览器的同源策略： 协议、域名、端口，三者一致

- 标签的请求 无视 同源策略

- 所有的跨域，服务端必须支持才能跨域

- JSONP

  - 利用script标签不受同源策略影响

  - 服务端协同callback名称，返回callback的调用，数据入参

  - 只能get请求

  - 简易DEMO

    ```html
    <script>
    	window.jsonpCallBack = (data) => {
        console.log(data)
      }
    </script>
    <script src="http://remote/api"></script>
    ```

    ```javascript
    jsonpCallBack({
    	data:{
    		...
    	}
    })
    ```

- CORS 服务端响应header设置，拿Node.js为例

  ```javascript
  // 允许跨域请求的源
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")
  // 允许跨域请求的Headers的字段，用逗号隔开
  res.setHeader("Access-Control-Allow-Headers", "Conten-Type, X-PINGOTHER")
  // 允许跨域请求的method，用逗号隔开
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT")
  // 允许跨域请求携带cookies
  res.setHeader("Access-Control-Allow-Credentials", "true")
  ```

### fetch

fetch是比较新的一个浏览器API，目前并不是所有的浏览器（比如所有IE都不支持）都支持。

```javascript
fetch('/api', {
	method:'post',
	// 默认不带cookies，可以设置 credentials = 'include'
	credentials: 'include',
  body:JSON.stringify({
    username:'xxx'
  })
  mode:'cors',
}).then((res)=>{
  
}).catch((err)=>{
  
})
```

- fetch默认不带cookies，需要配置`credentials = 'include'`
- 需要自行处理http code错误。

## 客户端存储

### cookie

```javascript
document.cookie = 'a=100;b=200'
document.cookie // 'a=100;b=200'
document.cookie = 'b=300'
document.cookie // 'a=100;b=300'
document.cookie = 'c=500'
document.cookie // 'a=100;b=300;c=500'
```

- 存在的key会覆盖，不存在的key会追加
- 请求会自动携带cookie
- 具有长度限制，最大**4kb**

### localStorage/sessionStorage

- HTML5 带来的客户端存储方案
- 空间大，最大可存储**5M**
- 同域多TAB共享：
  - localStorage直接共享
  - sessionStorage只有TAB是由另外一个TAB衍生（`window.open`），则属于同一个session，此时才可共享sessionStorage。