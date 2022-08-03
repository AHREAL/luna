---
title: Polyfill一个Promise
date: 2022-07-31 00:41:30
updated: 2022-08-03 23:57:30
tags: JavaScript
categories: JavaScript
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/20220801224902.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/20220801224902.png
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

根据一些手写Promise的分享，结合自己一些理解，模拟Promise的实现。

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
callRes = successCall(this.successValue)

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
then(successCall, errorCall) {
  return new MyPromise((resolve, reject) => {
    let callRes = undefined
    if (this.status === FULFILLED) {
      callRes = successCall(this.successValue)

      if (callRes instanceof MyPromise) {
        /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
        callRes.then(resolve, reject)
      } else {
        /** 不是promise对象，直接resolve */
        resolve(callRes)
      }
    } else if (this.status === REJECTED) {
      callRes = errorCall(this.errorReson)

      if (callRes instanceof MyPromise) {
        /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
        callRes.then(resolve, reject)
      } else {
        /** 不是promise对象，直接resolve */
        resolve(callRes)
      }
    } else {
      this.successCall.push(() => {
        callRes = successCall(this.successValue)
        if (callRes instanceof MyPromise) {
          /** callRes是promise对象，得把resolve和reject注册到新的promise对象上 */
          callRes.then(resolve, reject)
        } else {
          /** 不是promise对象，直接resolve */
          resolve(callRes)
        }
      })
      this.errorCall.push(() => {
        callRes = errorCall(this.errorReson)
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
            fn()
        })
        this.successCall = []
    }

    reject = (value) => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        this.errorReson = value
        this.errorCall.forEach(fn => {
            fn()
        })
        this.errorCall = []
    }

    then(successCall, errorCall) {
        return new MyPromise((resolve, reject) => {
            let callRes = undefined
            if (this.status === FULFILLED) {
                callRes = successCall(this.successValue)
                handleResolve(callRes, resolve, reject)
            } else if (this.status === REJECTED) {
                callRes = errorCall(this.errorReson)
                handleResolve(callRes, resolve, reject)
            } else {
                this.successCall.push(() => {
                    callRes = successCall(this.successValue)
                    handleResolve(callRes, resolve, reject)
                })
                this.errorCall.push(() => {
                    callRes = errorCall(this.errorReson)
                    handleResolve(callRes, resolve, reject)
                })
            }
        })
    }
}

function handleResolve(callRes, resolve, reject){
    if (callRes instanceof MyPromise) {
        callRes.then(resolve, reject)
    } else {
        resolve(callRes)
    }
}
```



# 错误处理

一共有两处地方会执行用户的代码，`constructor`和`then`

**处理constructor**

```javascript
constructor(exec) {
  try{
    exec(this.resolve, this.reject) 
  }catch(err){
    this.reject(err)
  }
}
```

**处理then**

先写局部，如果出现异常，直接调用返回的promise对象的reject

```javascript
if (this.status === FULFILLED) {
  try {
    callRes = successCall(this.successValue);
    handleResolve(callRes, resolve, reject);
  } catch (err) {
    reject(err)
  }
}
```

**再处理下异步的情况，完整代码如下**

```javascript
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(exec) {
    try {
      exec(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  status = PENDING;
  successCall = [];
  errorCall = [];

  resolve = (value) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.successValue = value;
    // 需要执行数组中的所有函数
    this.successCall.forEach((fn) => {
      fn();
    });
    this.successCall = [];
  };

  reject = (value) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.errorReson = value;
    this.errorCall.forEach((fn) => {
      fn();
    });
    this.errorCall = [];
  };

  then(successCall, errorCall) {
    return new MyPromise((resolve, reject) => {
      let callRes = undefined;
      if (this.status === FULFILLED) {
        try {
          callRes = successCall(this.successValue);
          handleResolve(callRes, resolve, reject);
        } catch (err) {
          reject(err);
        }
      } else if (this.status === REJECTED) {
        try {
          callRes = errorCall(this.errorReson);
          handleResolve(callRes, resolve, reject);
        } catch (err) {
          reject(err);
        }
      } else {
        this.successCall.push(() => {
          try {
            callRes = successCall(this.successValue);
            handleResolve(callRes, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
        this.errorCall.push(() => {
          try {
            callRes = errorCall(this.errorReson);
            handleResolve(callRes, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
    });
  }
}

function handleResolve(callRes, resolve, reject) {
  if (callRes instanceof MyPromise) {
    callRes.then(resolve, reject);
  } else {
    resolve(callRes);
  }
}
```



# 可选参数

我们并没有处理then没有传递参数的情况，其实`successCall`和`errorCall`都应该是可选的参数，如果没有传递的话，应该将success或者error往下传递，直到有then的参数可以处理。

**特性DEMO**

```javascript
// 假设这个promise已经fulfilled，那么需要把状态传递下去，直到被处理
promise
  .then()
  .then()
// 传递到这里被处理
  .then((value)=>{
  console.log(value)
})

// 假设这个promise已经rejected，那么需要把状态传递下去，直到被处理
promise
  // 这个then没有errorCall，那么会直接往下传递
  .then((value)=>{
  console.log(value)
}).then((value)=>{
  console.log(value)
  // 传递到这里被处理
}, (err)=>{
  console.error(err)
})
```

只需改写下then，即可达到该效果

```javascript
then(successCall, errorCall) {
  successCall = successCall ? successCall : (value) => value;
  errorCall = errorCall
    ? errorCall
  : (value) => {
    throw value;
  };
}
```



# 静态方法Promise.all

先列出Promise.all的特点：

1. 接受一个数组，数组中可以存放任意值。
2. 返回一个promise对象，当数组中的promise全部完成，则调用`successCall`，如果有一个失败，调用`errorCall`
3. `successCall`和`errorCall`接收的参数数组元素顺序，和一开始All接收的元素顺序一致。

```javascript
static all(array) {
  return new MyPromise((resolve, reject) => {
    const res = [];
    function deal(index, value) {
      res[index] = value;
      // 当res的长度和array的长度一致，表示全部元素已经处理完成
      if (res.length === array.length) {
        resolve(res);
      }
    }
    for (let i = 0; i < array.length; i++) {
      const tem = array[i];
      if (tem instanceof MyPromise) {
        tem.then(
          (value) => deal(i, value),
          (err) => reject(err)
        );
      } else {
        deal(i, tem);
      }
    }
  });
}
```



# 静态方法Promise.resolve

Promise.resolve接收一个参数，快速创建一个fulfilled的promise对象并返回。

```javascript
static resolve(value) {
  // 如果接收到的value已经是一个promise对象了，那么无需创建直接返回
  if(value instanceof MyPromise) return value
  // 创建promise对象，并立即调用resolve
  return new MyPromise((resolve)=>resolve(value))
}
```



# finally

finally特点：

1. 不管promise是成功，还是失败，都会执行接受到的callback
2. 透传上一个then方法的返回值
3. callback返回promise对象，那么直接返回这个promise对象，否则返回一个新的promise对象

```javascript
finally(callback) {
  return this.then(
    (value) => {
      return MyPromise.resolve(callback()).then(() => value);
    },
    (err) => {
      return MyPromise.resolve(callback()).then(() => {
        throw err;
      });
    }
  );
}
```



# catch

catch只接受一个函数参数，这个函数只处理promise失败的情况，相当于catch接受的函数注册为`errorCall`。

```javascript
catch(errorCall){
  return this.then(undefined, errorCall)
}
```

