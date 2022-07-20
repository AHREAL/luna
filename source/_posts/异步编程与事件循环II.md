---
title: 异步编程与事件循环II
date: 2022-07-20 22:01:30
updated: 2022-07-20 22:01:30
tags: JavaScript
categories: JavaScript
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202207202202136.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202207202202136.png
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

针对于浏览器异步编程和事件循环更多的补充~

# 同步模式（Synchronous）

JavaScript执行过程中大部分代码都是同步代码，同步代码的执行是需要排队执行的。

即后一个任务需要等待前一个任务完成，如果前一个任务持续时间较长，那么就会出现**阻塞**。

一个任务的执行需要先压入调用栈，执行完成后，再弹栈。

# 异步模式（Asynchronous）

异步模式的API不会等待任务的结束才开始下一个任务，对于耗时操作都是开启过后立即执行下一个任务，耗时操作的后续逻辑一般通过回调函数的方式去定义。

如果没有异步模式，那么单线程的JavaScript就无法同时处理大量耗时任务。

```javascript
console.log(1)

setTimeout(function fn1(){
    console.log(5)
}, 2000)

setTimeout(function fn2(){
    console.log(3)
    setTimeout(function fn3(){
        console.log(4)
    },500)
}, 1000)

console.log(2)
```

如上案例，程序运行的过程：

1. 包裹匿名函数`anonymous`压入调用栈
2. 压入`console.log(1)`
3. 控制台打印`1`
4. 弹出`console.log(1)`
5. 压入`setTimeout(fn1)`
6. 放入web apis等待计时2s
7. 弹出`setTimeout(fn1)`
8. 压入`setTimeout(fn2)`
9. 放入web apis等待计时1s
10. 弹出`setTimeout(fn2)`
11. 压入`console.log(2)`
12. 控制台打印`2`
13. 弹出`console.log(2)`
14. 弹出包裹匿名函数`anonymous`
15. 此时调用栈为空，**event loop** 轮询 **消息队列**
16. 1s时间到，`fn2` 推入**消息队列**
17. 消息队列出列一个任务`fn2`压入
18. 压入` console.log(3)`
19. 控制台打印`3`
20. 弹出`console.log(3)`
21. 压入`setTimeout(fn3)`
22. 放入web apis等待计时0.5s
23. 弹出`setTimeout(fn3)`
24. 弹出`fn2`
25. 此时调用栈为空，**event loop** 轮询 **消息队列**
26. 1.5s时间到，`fn3` 推入**消息队列**
27. 消息队列出列一个任务`fn3`压入
28. 压入` console.log(4)`
29. 控制台打印`4`
30. 弹出`console.log(4)`
31. 弹出`fn3`
32. 此时调用栈为空，**event loop** 轮询 **消息队列**
33. 2s时间到，`fn1` 推入**消息队列**
34. 消息队列出列一个任务`fn1`压入
35. 压入` console.log(5)`
36. 控制台打印`5`
37. 弹出`console.log(5)`
38. 弹出`fn1`

# Promise

Promise是一种更优的异步编程解决方案，解决了传统回调方式回调地狱问题。

CommonJs社区提出了Promise规范，在ES2015被标准化。

Promise三种状态：

- Pending 待定
- Fulfilled 成功，执行成功回调
- Rejected 失败，执行失败回调

Promise的状态扭转只有Pending -> Fulfilled 或者 Pending -> Rejected， 且**不可逆**。



**Promise一大优势是，他支持链式调用。**

```javascript
const getValue = () => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const v = Math.random()
            if(v > 0.5) return resolve(v)
            reject(v)
        },1000)
    })
}


getValue().then((value)=>{
    console.log('success1', value)
    return getValue()
}).then((value)=>{
    console.log('success2',value)
    return 'return value success2'
}).then((value)=>{
    console.log('success3',value)
}).catch((value)=>{
    console.log('catch', value)
})
```

`then`方法的返回值，一定是一个**全新**Promise对象，但后续的`then`回调逻辑如何执行，取决于上一个`onFulfilled`或`onRejected`如何定义。

- 如果上一个回调（注意不是then返回，是回调返回）返回一个Promise对象，那么下一个`then`函数执行会继续根据Promise的结果去确定执行`onFulfilled`或者`onRejected`
- 如果上一个回调返回的是非Promise对象，那么下一个`then`函数执行会直接执行`onFulfilled`回调，并入参上一个回调的返回值
- 如果上一个回调没有注册`onRejected`并且上一个Promise对象`rejected`了，那么会直接穿过后续的所有`then`，直接找到`catch`注册的回调（如果有）