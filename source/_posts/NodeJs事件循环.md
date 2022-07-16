---
title: NodeJs事件循环
date: 2020-05-21 12:52:46
updated: 2020-05-22 11:32:16
tags: NodeJs
categories: JavaScript
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/node.webp 
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/node.webp 
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

## Node.js事件循环

**当Node.js启动时会初始化event loop, 每一个event loop都会包含按如下六个循环阶段，nodejs事件循环和浏览器的事件循环完全不一样。**

> *When Node.js starts, it initializes the event loop, processes the provided input script (or drops into the REPL, which is not covered in this document) which may make async API calls, schedule timers, or call process.nextTick(), then begins processing the event loop.*

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1588943212159_0.6122.png)



> *注意: 图中的每个方框被称作事件循环的一个”阶段(phase)”*, 这6个阶段为一轮事件循环。

###  事件循环阶段

- **timers(定时器)** : 此阶段执行那些由 `setTimeout()` 和 `setInterval()` 调度的回调函数.

- **I/O callbacks(I/O回调)** : 此阶段会执行几乎所有的回调函数, 除了 **close callbacks(关闭回调)** 和 那些由 **timers** 与 `setImmediate()`调度的回调.

  > setImmediate 约等于 setTimeout(cb,0)

- idle(空转), prepare : 此阶段只在内部使用

- **poll(轮询)** : 检索新的I/O事件; 在恰当的时候Node会阻塞在这个阶段

- check(检查) : `setImmediate()` 设置的回调会在此阶段被调用

- close callbacks(关闭事件的回调): 诸如 `socket.on('close', ...)` 此类的回调在此阶段被调用

在事件循环的每次运行之间, Node.js会检查它是否在等待异步I/O或定时器, 如果没有的话就会自动关闭.

> 如果event loop进入了 poll阶段，且代码未设定timer，将会发生下面情况：
>
> - 如果poll queue不为空，event loop将同步的执行queue里的callback,直至queue为空，或执行的callback到达系统上限;
> - 如果poll queue为空，将会发生下面情况：
>   - 如果代码已经被setImmediate()设定了callback, event loop将结束poll阶段进入check阶段，并执行check阶段的queue (check阶段的queue是 setImmediate设定的)
>   - 如果代码没有设定setImmediate(callback)，event loop将阻塞在该阶段等待callbacks加入poll queue,一旦到达就立即执行
>
> 如果event loop进入了 poll阶段，且代码设定了timer：
>
> - 如果poll queue进入空状态时（即poll 阶段为空闲状态），event loop将检查timers,如果有1个或多个timers时间时间已经到达，event loop将按循环顺序进入 timers 阶段，并执行timer queue.

### 代码执行1

> `path.resolve()` 方法会把一个路径或路径片段的序列解析为一个绝对路径。
>
> `fs.readFile` 异步地读取文件的全部内容。
>
> `__dirname` 总是指向被执行文件夹的绝对路径

```js
var fs = require('fs');
var path = require('path');

function someAsyncOperation (callback) {
  // 花费2毫秒
  fs.readFile(path.resolve(__dirname, '/read.txt'), callback);
}

var timeoutScheduled = Date.now();
var fileReadTime = 0;

setTimeout(function () {
  var delay = Date.now() - timeoutScheduled;
  console.log('setTimeout: ' + (delay) + "ms have passed since I was scheduled");
  console.log('fileReaderTime',fileReadtime - timeoutScheduled);
}, 10);

someAsyncOperation(function () {
  fileReadtime = Date.now();
  while(Date.now() - fileReadtime < 20) {

  }
});
```

### 代码执行2

```js
var fs = require('fs');

function someAsyncOperation (callback) {
  var time = Date.now();
  // 花费9毫秒
  fs.readFile('/path/to/xxxx.pdf', callback);
}

var timeoutScheduled = Date.now();
var fileReadTime = 0;
var delay = 0;

setTimeout(function () {
  delay = Date.now() - timeoutScheduled;
}, 5);

someAsyncOperation(function () {
  fileReadtime = Date.now();
  while(Date.now() - fileReadtime < 20) {

  }
  console.log('setTimeout: ' + (delay) + "ms have passed since I was scheduled");
  console.log('fileReaderTime',fileReadtime - timeoutScheduled);
});
```

### 代码执行3

> 在nodejs中， setTimeout(demo, 0) === setTimeout(demo, 1)
>
> 在浏览器里面 setTimeout(demo, 0) === setTimeout(demo, 4)

```js
setTimeout(function timeout () {
  console.log('timeout');
},1);

setImmediate(function immediate () {
  console.log('immediate');
});
// setImmediate它有时候是1ms之前执行，有时候又是1ms之后执行？
```

> 因为event loop的启动也是需要时间的，可能执行到poll阶段已经超过了1ms，此时setTimeout会先执行。反之setImmediate先执行

```js
var path = require('path');
var fs = require('fs');

fs.readFile(path.resolve(__dirname, '/read.txt'), () => {
    setImmediate(() => {
        console.log('setImmediate');
    })
    
    setTimeout(() => {
        console.log('setTimeout')
    }, 0)
});
```



### process.nextTick

**process.nextTick()不在event loop的任何阶段执行，而是在各个阶段切换的中间执行**,即从一个阶段切换到下个阶段前执行。

```js
var fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate');
    process.nextTick(()=>{
      console.log('nextTick3');
    })
  });
  process.nextTick(()=>{
    console.log('nextTick1');
  })
  process.nextTick(()=>{
    console.log('nextTick2');
  })
});
```

#### 设计原因

允许开发者通过递归调用 `process.nextTick()` 来阻塞I/O操作。

#### nextTick应用场景

1. 在多个事件里交叉执行CPU运算密集型的任务：

```js
var http = require('http');

function compute() {
    
    process.nextTick(compute);//
}

http.createServer(function(req, res) {  // 服务http请求的时候，还能抽空进行一些计算任务
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end('Hello World');
}).listen(5000, '127.0.0.1');

compute();
```

> 在这种模式下，我们不需要递归的调用compute()，我们只需要在事件循环中使用process.nextTick()定义compute()在下一个时间点执行即可。在这个过程中，如果有新的http请求进来，事件循环机制会先处理新的请求，然后再调用compute()。反之，如果你把compute()放在一个递归调用里，那系统就会一直阻塞在compute()里，无法处理新的http请求了。

2. 保持回调函数异步执行的原则

当你给一个函数定义一个回调函数时，你要确保这个回调是被异步执行的。下面我们看一个例子，例子中的回调违反了这一原则：

``` js
function asyncFake(data, callback) {        
    if(data === 'foo') callback(true);
    else callback(false);
}

asyncFake('bar', function(result) {
    // this callback is actually called synchronously!
});
```
为什么这样不好呢？我们来看Node.js 文档里一段代码：
```js
var client = net.connect(8124, function() { 
    console.log('client connected');
    client.write('world!\r\n');
});
```

在上面的代码里，如果因为某种原因，net.connect()变成同步执行的了，回调函数就会被立刻执行，因此回调函数写到客户端的变量就永远不会被初始化了。

这种情况下我们就可以使用process.nextTick()把上面asyncFake()改成异步执行的：

```js
function asyncReal(data, callback) {
    process.nextTick(function() {
        callback(data === 'foo');       
    });
}
```

3. 用在事件触发过程中

   > EventEmitter有2个比较核心的方法， on和emit。node自带发布/订阅模式

```js
var EventEmitter = require('events').EventEmitter;

function StreamLibrary(resourceName) { 
    this.emit('start');
}
StreamLibrary.prototype.__proto__ = EventEmitter.prototype;   // inherit from EventEmitter

```

```js
var stream = new StreamLibrary('fooResource');

stream.on('start', function() {
    console.log('Reading has started');
});

```

```js
function StreamLibrary(resourceName) {      
    var self = this;

    process.nextTick(function() {
        self.emit('start');
    });  // 保证订阅永远在发布之前

    // read from the file, and for every chunk read, do:        
    
}
```