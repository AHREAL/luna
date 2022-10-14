---
title: Jest自动化测试
date: 2022-10-14 14:50:50
updated: 2022-10-14 14:50:50
tags: 前端工程化
categories: 前端工程化
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202209142117363.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202209142117363.png
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

# 自动化测试

## 什么是自动化测试？

[自动化测试wiki](https://zh.wikipedia.org/wiki/自动化测试)，概括来说就是，**在测试流程已经确定后，自动执行的一些重复但必要测试工作**。

细分测试有三种类型：`Unit`(单元测试)、`Integration`(集成测试)、`End-to-end`(端到端测试)

1. 单元测试（本次分享主要围绕这个）

单元测试是测试一个模块，不依赖任何外部资源

因为没有测试应用依赖的外部资源(如操作数据库等)，无法确保应用以及功能的可靠性，这时候就需要集成测试了

2. 集成测试

测试一个模块或者多个模块，并伴随着它们对应的外部依赖资源，它测试的是应用代码的集成性，比如文件或者数据库。

这种代码执行起来稍慢，因为他们经常需要读写数据库，但是它能帮助你更加确保应用的可靠性

集成测试的定义是：一次测试多个模块，并将他们视作一个整体来测试。如果你将两个模块放到一起测试，有人觉得这是在做集成测试，其实不是，而是单元测试.

为什么？因为他们没有任何的外部资源，集成测试是将一个或者多个模块与外部资源一并测试

3. 端对端测试

依靠用户界面来驱动测试，这类测试可以保证很高的可靠性，但是它有两个很大的问题。

- 效率低，因为每次测试都需要加载用户界面，每次测试都需要加载应用，也许还要用户登录，导航到指定页面，提交表单并检查结果，等等一系列，所以测试效率非常的慢。
- 不稳定，因为一个程序、页面修改一下，如果 UI 变了，操作逻辑变了，就会破坏测试

## 什么是前端自动化测试？

```javascript
// 假设我们有这么一个函数，实现加法
function add(x, y){
  return x + y
}

// 我们可以设计这么一个测试用例来保证add函数运行符合预期
function test(){
  const expect = add(1,2)
  const target = 3
  if(expect === target){
    console.log('add函数通过测试')
  }else{
    console.error(`add函数没有通过测试，预期${target}，输出${expect}`)
  }
}
```

只要运行 add(1,2) 输出3，那么我们即可认为这个**函数符合预期，通过测试。**

如果我们在迭代过程中，不小心改到了add函数，但我们不确定是否有影响，其实也不用担心，因为单元测试能很快帮助我们验证是否其中有错误。

可以发现写的测试代码都是**一个套路**，先预期结果是什么，再计算出真正的结果，进行对比，最终看值是否相等。

# 测试框架-Jest

![image-20221008214641523](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202210081546566.png)

前端自动化测试框架很多（Jest/Mocha/Jasmine），本次分享[Jest](https://www.jestjs.cn/)（GitHub⭐️最多）。

Jest相较其他具有优势：

1. 容易安装，可零配置
2. 提供jsdom
3. 友好的覆盖率报告

# 简单示例

取map函数进行演示，那么可以创建这么一个测试文件`index.test.js`

```javascript
const Base = require('./index')
// "test map api" 表示对当前测试用例的描述
test("test map api", ()=>{
  	// expect表示期待某个值, toEqual对比结果
    expect(Base.map([1,2,3], (item)=>item+1)).toEqual([2,3,4])
})
```

命令行运行`jest`命令表示开始测试。

此时jest会在当前目录下，寻找所有以`test.js`结尾的文件，并在运行时注入jest api（比如我们上面用例用到的test，expect），然后再控制台输出测试报告。

![image-20221008220608817](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202210081606853.png)



# 断言

> 测试即运行结果是否与我们预期结果一致 断言函数用来验证结果是否正确
>
> https://jestjs.io/zh-Hans/docs/using-matchers

```javascript
expect('运行结果').toBe('期望的结果');
//常见断言方法
expect('a').toBe('a')//判断两个对象是否相等
expect(1).not.toBe(2)//判断不等
expect({ a: 1, foo: { b: 2 } }).toEqual({ a: 1, foo: { b: 2 } })
expect(n).toBeNull(); //判断是否为null
expect(n).toBeUndefined(); //判断是否为undefined
expect(n).toBeDefined(); //判断结果与toBeUndefined相反
expect(n).toBeTruthy(); //判断结果为true
expect(n).toBeFalsy(); //判断结果为false
expect(value).toBeGreaterThan(3); //大于3
expect(value).toBeGreaterThanOrEqual(3.5); //大于等于3.5
expect(value).toBeLessThan(5); //小于5
expect(value).toBeLessThanOrEqual(4.5); //小于等于4.5
expect(value).toBeCloseTo(0.3); // 浮点数判断相等
expect('Christoph').toMatch(/stop/); //正则表达式判断
expect(['one','two']).toContain('one'); //是否包含
```

# 异步测试

我们有这么一段异步代码需要进行测试

```javascript
function fetch(){
    return new Promise((resolve, reject)=>{
        // 用一个setTimeout模拟异步函数
        setTimeout(()=>{
            resolve({
                code:0,
                msg:'ok'
            })
        }, 2000)
    })
}

module.exports = fetch
```

```javascript
const fetch = require('./fetch')
// 声明形参done表示，测试的函数是一段异步函数
test("test fetch api", (done)=>{
    fetch().then(res=>{
        expect(res.code === 0).toBeTruthy()
      	// done调用表示测试完成
        done()
    })
})
```

# 覆盖率

Jest提供一个可以快速查看测试覆盖率的API，运行 `Jest --coverage`

Jest默认会在当前目录下创建一个coverage存放覆盖率报告。

![image-20221008221400698](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202210081614731.png)

还有具体表示哪些代码没有被测试覆盖到

![image-20221008225354193](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202210081653224.png)



# 钩子函数

Jest执行过程中的各种时期

```javascript
beforeAll(()=>{
	console.log('所有测试用例执行前-beforeAll')
})

afterAll(()=>{
  console.log('所有测试用例执行后-afterAll')
})

beforeEach(()=>{
  console.log('每个测试用例执行前-beforeEach')
})
```

常见的场景是，处理测试非纯函数的代码造成的污染，比如`without`函数。

```javascript
const Base = require('@ncfe/nc.base')
let testData

beforeEach(()=>{
  testData = [1,2,3,4,5]
})

test('test without', ()=>{
  expect(Base.without(testData, [3])).toEqual([1,2,4,5])
})

test('test sort', ()=>{
  // 不会被 without污染
  expect(Base.findIndex(testData, (item)=>item === 3).toBe(2)
})
```



# DOM测试

在 Jest 里对 Dom 操作非常简单，Jest 实际是在 Node 的环境中，但 Node 本身不具备 Dom

原因是 Jest 在 Node 中自己模拟了一套 Dom API，一般称作 **jsDom**

直接使用 `document.getElementById` 这种原生 JS 的写法也是没问题的

```javascript
describe('DOM测试', () => {
    it('测试按钮是否被渲染 ', () => {
        document.body.innerHTML = `<button id='btn'>button</button>`
        expect(document.getElementById('btn')).not.toBeNull();
        expect(document.getElementById('btn').toString()).toBe("[object HTMLButtonElement]");
    });

    it('测试点击事件', () => {
        // jest.fn可以快速mock一个函数
        const mockClickHandle = jest.fn();
        document.body.innerHTML = `
        <div>
            <button id='btn'>按钮</button>
        </div> `
        const btn = document.getElementById('btn');
        btn.onclick = mockClickHandle;
        btn.click();
        expect(mockClickHandle).toBeCalled();
        expect(mockClickHandle).toHaveBeenCalledTimes(1);
        btn.click();
        btn.click();
        // 调用次数
        expect(mockClickHandle).toHaveBeenCalledTimes(3);
    });
});
```

