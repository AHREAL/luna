---
title: 异步编程与事件循环III
date: 2022-07-31 00:41:30
updated: 2022-07-31 00:41:30
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

拆解异步API的模拟实现

# 实现Promise

观察Promise，分步骤实现Promise特性

1. Promise 就是一个类， 执行这个类的时候，需要传递一个执行器函数，执行器函数立即调用，并入参resolve, reject

   ```javascript
   class MyPromise {
       constructor(exec){
           exec(this.resolve, this.reject)
       }
     
     	resolve = () => {
         
       }
     
     	reject = () => {
         
       }
   }
   ```

2. Promise 三种状态， 成功 fulfilled 失败 rejected 等待 pending（初始）

   ```javascript
   const PENDING = 'pending'
   const FULFILLED = 'fulfilled'
   const REJECTED = 'rejected'
   
   class MyPromise {
       constructor(exec){
           exec(this.resolve, this.reject)
       }
   
       status = PENDING
   }
   ```

3. resolve和reject函数会改变状态，状态**不可逆**

   ```javascript
   resolve = () => {
     if (this.status !== PENDING) return
     this.status = FULFILLED
   }
   
   reject = () => {
     if (this.status !== PENDING) return
     this.status = REJECTED
   }
   ```

4. then方法内部做的事情就是判断状态，如果状态是成功则调用成功回调，如果失败则调用失败回调

   ```javascript
   then(successCall, errorCall){
     if(this.status === FULFILLED){
       successCall()
     }else if(this.status === REJECTED){
       errorCall()
     }
   }
   ```

5. 成功回调入参resolve传递的参数，失败回调入参reject传递的参数

   ```javascript
   resolve = (value) => {
     if (this.status !== PENDING) return
     this.status = FULFILLED
     this.successValue = value
   }
   
   reject = (value) => {
     if (this.status !== PENDING) return
     this.status = REJECTED
     this.errorReson = value
   }
   
   then(successCall, errorCall){
     if(this.status === FULFILLED){
       successCall(this.successValue)
     }else if(this.status === REJECTED){
       errorCall(this.errorReson)
     }
   }
   ```

**完整代码**

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(exec) {
    exec(this.resolve, this.reject)
  }

  status = PENDING

  resolve = () => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.successValue = value
  }

  reject = () => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.errorReson = value
  }

  then(successCall, errorCall){
    if(this.status === FULFILLED){
      successCall(this.successValue)
    }else if(this.status === REJECTED){
      errorCall(this.errorReson)
    }
  }
}
```

# 异步

Promise的then方法并不是所有情况下都立即执行，所以需要处理then执行时，状态还是`pending`的情景。

如果还是`pending`，那么把成功回调和失败回调保存起来

```javascript
then(successCall, errorCall){
  if(this.status === FULFILLED){
    successCall(this.successValue)
  }else if(this.status === REJECTED){
    errorCall(this.errorReson)
  }else{
    this.successCall = successCall
    this.errorCall = errorCall
  }
}
```

在`resolve`或者`reject`的时调用

```javascript
resolve = (value) => {
  if (this.status !== PENDING) return
  this.status = FULFILLED
  this.successValue = value
  this.successCall(value)
}

reject = (value) => {
  if (this.status !== PENDING) return
  this.status = REJECTED
  this.errorReson = value
  this.errorCall(value)
}
```



# 调用多次then

Promise支持同一个promise对象，调用多次then方法，来注册多个成功或者失败的回调

```javascript
const p = new Promise()
p.then(()=>{},()=>{})
p.then(()=>{},()=>{})
```

改造下代码，`successCall` 和 `errorCall`要支持存多个

```javascript
successCall = []
errorCall = []

then(successCall, errorCall){
  if(this.status === FULFILLED){
    successCall(this.successValue)
  }else if(this.status === REJECTED){
    errorCall(this.errorReson)
  }else{
    // 改成数组的形式
    this.successCall.push(successCall)
    this.errorCall.push(errorCall)
  }
}
```

处理下异步情况

```javascript
resolve = (value) => {
  if (this.status !== PENDING) return
  this.status = FULFILLED
  this.successValue = value
  // 需要执行数组中的所有函数
  this.successCall.forEach(fn=>{
    fn(value)
  })
  this.successCall = []
}

reject = (value) => {
  if (this.status !== PENDING) return
  this.status = REJECTED
  this.errorReson = value
  this.errorCall.forEach(fn=>{
    fn(value)
  })
  this.errorCall = []
}
```

**完整代码**

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(exec) {
    exec(this.resolve, this.reject)
  }

  status = PENDING
  successCall = []
  errorCall = []

  resolve = (value) => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.successValue = value
    // 需要执行数组中的所有函数
    this.successCall.forEach(fn => {
      fn(value)
    })
    this.successCall = []
  }

  reject = (value) => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.errorReson = value
    this.errorCall.forEach(fn => {
      fn(value)
    })
    this.errorCall = []
  }

  then(successCall, errorCall) {
    if (this.status === FULFILLED) {
      successCall(this.successValue)
    } else if (this.status === REJECTED) {
      errorCall(this.errorReson)
    } else {
      // 改成数组的形式
      this.successCall.push(successCall)
      this.errorCall.push(errorCall)
    }
  }
}
```



# 链式调用

实现链式调用的核心就是，需要返回链式调用实例本身，这点和jquery是类似的。

即，在then方法执行完成，需要返回一个新的Promise对象。

```javascript
then(successCall, errorCall) {
  const p = new MyPromise()
  if (this.status === FULFILLED) {
    successCall(this.successValue)
  } else if (this.status === REJECTED) {
    errorCall(this.errorReson)
  } else {
    this.successCall.push(successCall)
    this.errorCall.push(errorCall)
  }
  return p
}
```

Promise的链式调用，需要拿到上次成功回调return的值，并作为下次成功回调的入参。

```javascript
then(successCall, errorCall) {
  return new MyPromise((resolve) => {
    let callRes = undefined
    // 这里注意的是，由于Promise exec函数式立即执行，所以我们可以直接把逻辑包在新Promise的exec函数，方便我们取到callRes
    if (this.status === FULFILLED) {
      callRes = successCall(this.successValue)
      // 新的Promise对象直接转成fulfilled并入参上一个Promise对象的成功回调返回值
      resolve(callRes)
    } else if (this.status === REJECTED) {
      errorCall(this.errorReson)
    } else {
      this.successCall.push(successCall)
      this.errorCall.push(errorCall)
    }
  })
}
```

再处理下同步的`REJECTED`和异步的情况

```javascript
then(successCall, errorCall) {
  return new MyPromise((resolve, reject) => {
    let callRes = undefined
    if (this.status === FULFILLED) {
      callRes = successCall(this.successValue)
      resolve(callRes)
    } else if (this.status === REJECTED) {
      // 如果errorcall有返回值，那么作为下一个then的resolve参数
      callRes = errorCall(this.errorReson)
      resolve(callRes)
    } else {
      // 异步的情况也需要处理
      this.successCall.push(()=>{
        callRes = successCall(this.successValue)
        resolve(callRes)
      })
      this.errorCall.push(()=>{
        callRes = errorCall(this.errorReson)
        resolve(callRes)
      })
    }
  })
}
```



**到这里，完整的代码**

```javascript
class MyPromise {
  constructor(exec) {
    exec(this.resolve, this.reject)
  }

  status = PENDING
  successCall = []
  errorCall = []

  resolve = (value) => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.successValue = value
    this.successCall.forEach(fn => fn())
    this.successCall = []
  }

  reject = (value) => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.errorReson = value
    this.errorCall.forEach(fn => fn())
    this.errorCall = []
  }

  then(successCall, errorCall) {
    return new MyPromise((resolve, reject) => {
      let callRes = undefined
      if (this.status === FULFILLED) {
        callRes = successCall(this.successValue)
        resolve(callRes)
      } else if (this.status === REJECTED) {
        callRes = errorCall(this.errorReson)
        resolve(callRes)
      } else {
        this.successCall.push(()=>{
          callRes = successCall(this.successValue)
          resolve(callRes)
        })
        this.errorCall.push(()=>{
          callRes = errorCall(this.errorReson)
          resolve(callRes)
        })
      }
    })
  }
}
```



# 返回promise的链式调用 

我们刚才处理的为在`successCall`或`errorCall`函数返回普通值的场景，如果返回了promise对象，那么需要特殊处理，即检查返回的`callRes`是否为`promise`对象，如果为`promise`对象，则要把新Promise对象的resolve和reject传递进`promise`对象的then回调 😈。

```javascript
callRes = call(this.successValue)

if (callRes instanceof MyPromise) {
  /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
  callRes.then(resolve, reject)
} else {
  /** 不是promise对象，直接resolve */
  resolve(callRes)
}
```

**整体then改造**

```javascript
then(call, error) {
  return new MyPromise((resolve, reject) => {
    let callRes = undefined
    if (this.status === FULFILLED) {
      callRes = call(this.successValue)

      if (callRes instanceof MyPromise) {
        /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
        callRes.then(resolve, reject)
      } else {
        /** 不是promise对象，直接resolve */
        resolve(callRes)
      }
    } else if (this.status === REJECTED) {
      callRes = error(this.errorReson)

      if (callRes instanceof MyPromise) {
        /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
        callRes.then(resolve, reject)
      } else {
        /** 不是promise对象，直接resolve */
        resolve(callRes)
      }
    } else {
      this.call.push(() => {
        callRes = call(this.successValue)
        if (callRes instanceof MyPromise) {
          /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
          callRes.then(resolve, reject)
        } else {
          /** 不是promise对象，直接resolve */
          resolve(callRes)
        }
      })
      this.error.push(() => {
        callRes = error(this.errorReson)
        if (callRes instanceof MyPromise) {
          /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
          callRes.then(resolve, reject)
        } else {
          /** 不是promise对象，直接resolve */
          resolve(callRes)
        }
      })
    }
  })
}
```

抽离下逻辑

```javascript
function handleResolve(callRes, resolve, reject){
    if (callRes instanceof MyPromise) {
        /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
        callRes.then(resolve, reject)
    } else {
        /** 不是promise对象，直接resolve */
        resolve(callRes)
    }
}
```

**最终完整代码**

```javascript
class MyPromise {
    constructor(exec) {
        exec(this.resolve, this.reject)
    }

    status = PENDING
    call = []
    error = []

    resolve = (value) => {
        if (this.status !== PENDING) return
        this.status = FULFILLED
        this.successValue = value
        // 需要执行数组中的所有函数
        this.call.forEach(fn => {
            fn()
        })
        this.call = []
    }

    reject = (value) => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        this.errorReson = value
        this.error.forEach(fn => {
            fn()
        })
        this.error = []
    }

    then(call, error) {
        return new MyPromise((resolve, reject) => {
            let callRes = undefined
            if (this.status === FULFILLED) {
                callRes = call(this.successValue)
                handleResolve(callRes, resolve, reject)
            } else if (this.status === REJECTED) {
                callRes = error(this.errorReson)
                handleResolve(callRes, resolve, reject)
            } else {
                this.call.push(() => {
                    callRes = call(this.successValue)
                    handleResolve(callRes, resolve, reject)
                })
                this.error.push(() => {
                    callRes = error(this.errorReson)
                    handleResolve(callRes, resolve, reject)
                })
            }
        })
    }
}
```

