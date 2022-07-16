---
title: React零碎扫描
date: 2021-2-16 20:08:32
updated: 2019-2-17 12:59:02
tags: React
categories: 框架技术
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/react-2.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/react-2.png
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

React零碎知识浅到使用深到原理的扫描

## 开始

深受ReactHooks的影响，已经非常非常久没有去写Class组件，甚至突然想想React的生命周期，甚至有些答不上来。

本次全程采用Class组件去温习一些React零碎的知识（无先后之分，想到什么记什么）。

## dangerouslySetInnerHTML

React默认帮助我们在插值的时候进行XSS攻击过滤。

```jsx
render(){
	reutrn (
  	<div>
    	{ this.state.htmlData }
    </div>
  )
}
```

我们需要改成

```jsx
render(){
	return (
		<div dangerouslySetInnerHTML={{__html:this.state.htmlData}}/>
	)
}
```

## 事件相关梳理

### bind this

class组件最令人诟病的一个问题就是this指向的问题。

```jsx
class Component extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name:'ahreal'
    }
  }
  handleClick(){
    console.log(this.state.name)
  }
  render(){
    return (
    	<div onClick={this.handleClick}>click me</div>
    )
  }
}
```

这样写，最后触发click事件回调时候，在访问this.state产生引用类型错误。

具体产生问题的原因是因为click回调的调用者并不是组件本身。

**解法1： 将handleClick的this绑定为组件本身**

```jsx
constructor(){
  this.handleClick = this.handleClick.bind(this)
}
```

**解法2： 使用静态方法+箭头函数声明handleClick**

```jsx
class Component extends React.Component {
  ...
  // 利用了箭头函数继承上下文this且无法修改的特性
  handleClick = () => {
    console.log(this.state.name)
  }
	...
}
```

**解法3：直接使用箭头函数绑定事件**

```jsx
render(){
  return (
  	<div onClick={()=>this.handleClick()}>click me</div>
  )
}
```

### event对象

event对象为React合成的对象，主要为了处理不同浏览器下的event兼容性问题。

React利用事件冒泡机制，将所有事件的监听器绑定在document上，以此来减少监听器的数量，节约空间。

**访问宿主本地event**

```jsx
e.nativeEvent
```

**current target**

```jsx
e.currentTarget // 绑定事件的dom对象
e.nativeEvent.currentTarget // document
```

我们打印currentTarget可发现，react合成事件对象currentTarget是绑定事件的dom对象，而真实的event的currentTarget是document，这也和react合成事件原理相符合。

**参数位置**

```jsx
class Component extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name:'ahreal'
    }
  }
  // React会自动在调用函数的入参尾部追加合成event对象
  handleClick(name, event){
    console.log(name)
    console.log(event)
  }
  render(){
    return (
    	<div onClick={this.handleClick.bind(this, 'ahreal')}>
        click me
      </div>
    )
  }
}
```

## 状态提升

状态提升本质上是一个概念性的东西，是使用React中非常重要的设计哲学。

我们要将状态提升到层级较高的组件，也就是日常开发中的`业务组件`

在开发中，我们要十分清楚什么是`业务组件`什么是`普通组件`。

**业务组件**

不可复用基本上是业务组件最大的特点，业务组件负责采集本次业务相关的通用组件进行组合，管理状态。

**普通组件**

与业务尽可能甚至完全解耦，不依赖于任何其他组件，最大特点是可复用性，自身维护的状态很少甚至没有，状态由业务组件传递而来。

## State

### 不可变值

React中，state是个不可变的值，每次setState其实是将整个老的state替换成了新的state，而不是在老的state上去修改。

**不要尝试直接修改state**

```jsx
// error 
this.state.name = 'xxx'
```

**必须通过setState去更新state**

```jsx
this.setState({
	name:'xxx'
})
```

### 异步

setState 是**异步更新**，React会收集一次循环周期内的所有setState，最后再一次性更新，所以通过同步的形式无法获取到最新的state的值

```jsx
this.setState({
	name:'ahreal'
})
this.state.name // 上一次的值'allen'
```

**首先可以在回调中获取最新的state值**

```jsx
this.setState({
	name:'ahreal'
}, ()=>{
	console.log(this.state.name) // 最新的值 'ahreal'
})
```

**但两种常见场景下，state可直接同步获取最新**

- 定时器中

  ```jsx
  setTimeout(()=>{
   	this.setState({
      name:'ahreal'
    }) 
    console.log(this.state.name) // 最新的值 'ahreal'
  })
  ```

### 合并

上面做笔记已经记录到，React会收集我们多次setState的值（同一次渲染周期，且都用对象形式进行setState），并最后进行合并。

```jsx
this.setState({
  count: this.state.count+1
})
this.setState({
  count: this.state.count+1
})
this.setState({
  count: this.state.count+1
})
// 最后只会得到count+1
```

```jsx
this.setState({
  count: 1
})
this.setState({
  count: 2
})
this.setState({
  count: 3
})
// 最后得到count=3，并不是多次赋值count，而是合并，根据调用位置，后面覆盖前面。
```

**使用函数形式setState，以便依赖上次相同周期内上一次setState的结果**

这个方法在Hooks也适用。

```jsx
this.setState((state)=>{
	return {
    count:state.count+1
  }
})
this.setState((state)=>{
	return {
    count:state.count+1
  }
})
this.setState((state)=>{
	return {
    count:state.count+1
  }
})
// 最后会得到 count
```

## 生命周期

hahahaha，中Hooks毒太深（学Hooks需要忘记生命周期的一些思维方式），但还是温习下类组件的生命周期。

顺带说一下，React逐渐抛弃了一些旧的生命周期，目前最新的React17中，已经只剩下或者说推荐使用的只有`constructor`,`render`,`componentDidMount`,`componentDidUpdate`,`componentWillUnmount`,`shouldComponentUpdate`

**constructor**

类组件实例化，接受props，调用super

**render**

渲染周期，有人不认为这是一个生命周期，这里保留意见。

**componentDidMount**

dom渲染完成后

**componentDidUpdate**

dom更新完成后

**componentWillUnmount**

组件卸载前，可用于销毁一些监听器，定时器等

**shouldComponentUpdate**

组件通过`setState`或者`props`(`forceUpdate`会绕过这个周期)更新引发自身重渲染之前，可通过这个函数返回决定是否重新渲染，是性能优化中较为高频的手段。

### 父子组件生命周期

回到React渲染原理，首先先从JSX转React.createElement来

假设我们有这么一段JSX代码

```jsx
<MyComponent>
	<Info/>
</MyComponent>
```

经过babel编译，会转换成

```jsx
React.createElement(MyComponent, {}, 
 React.createElement(Info, {}, [])
)
```

从外到内，成为一个递归的结构，父组件渲染完成之前，需要先把子组件渲染完成。

所以父组件的生命周期走到render的时候，会先去将子组件的生命周期完整执行完毕，在继续执行父组件剩余的生命周期比如`componentDidMount`

## Protals

传送门，可以把组件渲染到父组件外。

默认情况下，React会将组件渲染到父组件最近的节点。

```jsx
// children component
render(){
  return <div>i'm modal</div>
}
```

但是一些常见的场景需要我们将子组件渲染到父组件外部。

比如modal，message，mask等。

我们使用Protals组件，可以越过DOM层级，并**保持React组件树不变**

```jsx
// protals children component
// 可直接将组件渲染到body上
render(){
  return ReactDOM.createProtal(
  	<div>i'm modal</div>,
    document.body
  )
}
```

**保持React组件树不变**

这意味着，context，事件冒泡等一些依赖嵌套关系的情况下依然使用。

## Context

React中的状态上下文，适合于结构简单，不会频繁更新但需要多层传递state。

```jsx
const Ctx = React.createContext()

class MyConponent extends React.Component {
  ...
  // 方法1：内部指明类组件的contextType
  static contextType = Ctx
  render(){
    return (
    	<div>{this.context}</div>
    )
  }
  ...
}
// 方法2：外部指明类组件的contextType
MyConponent.contextType = Ctx

  
class FatherComponent extends React.Component {
  ...
  render(){
    return (
    	<div>
        <Ctx.Provider value={this.state.name}>
      		<MyConponent/>
        </Ctx.Provider>
      </div>
    )
  }
  ...
}
```

## 异步组件（懒加载组件）

React实现异步组件的几个关键实现点

- import()

  利用Webpack基于jsonp的懒加载，实现异步导入

- React.lazy

  接收一个返回Promise的函数

- React.Suspense

  可以用于渲染子组件没有渲染完成时显示的内容

```jsx
import React from 'react'

const Children = React.lazy(()=>import('./children'))
class MyComponent extends React.Component {
  render(){
    <div>
    	<React.Suspense fallback={<div>Loading...</div>}>
      	<Children/>
      </React.Suspense>
    </div>
  }
}
```

关于React.Suspense，我们还可用来防异步加载等待时的白屏。

```jsx
import React from 'react'

const Children = React.lazy(()=>import('./children'))
class MyComponent extends React.Component {
  render(){
    <div>
    	<React.Suspense fallback={<div>Loading...</div>}>
      	<Children/>
      </React.Suspense>
    </div>
  }
}
```

**网络超时fallback**

```jsx
import React from 'react'

const Children = React.lazy(()=>import('./children'))

class Loading extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isNetError:false
    }
  }
  componentDidMount(){
    this.timer = setTimeout(()=>{
     	this.setState({
        isNetError:true
      })
    }, 1000 * 10)
  }
  render(){
    return <div>{this.state.isNetError ? '网络超时' : '载入中'}</div>
  }
}

class MyComponent extends React.Component {
  render(){
    <div>
    	<React.Suspense fallback={<Loading></Loading>}>
      	<Children/>
      </React.Suspense>
    </div>
  }
}
```



## getDerivedStateFromError处理错误,防白屏

由于Suspense对于错误冒泡的处理并无捕获，而是将错误向上抛出，我们可以手动写个组件去捕获全局异常。

React在对于未捕获的错误的处理是，直接将整个ReactAPP卸载，也就是React的白屏。

我们可以定一个处理**错误边界**的组件，主要利用**getDerivedStateFromError**生命周期

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

将ErrorBoundary置于较高的层级，去捕获错误。

## 性能优化

### shouldComponentUpdate

React中类组件最常用的性能优化手段，默认情况下，React父组件更新，子组件也会全部更新（尽管子组件依赖的props没有产生变化），我们可以利用shouldComponentUpdate这个生命周期去比较两次Props的变化判断是否更新。

```jsx
class MyComponent extends React.Component {
  ...
  shouldComponentUpdate(prev,next){
    // 只有props.name发生改变才去更新组件
    if(prev.name !== next.name){
      return true
    }
    return false
  }
  ...
}
```

像引用类型的Props比如数组，在比较的时候就不能像基本类型那样直接比较，而是需要深比较（递归），其实更多的说法是，如果是需要递归比较引用类型，依旧是比较耗费性能，所以一般情况下，只进行浅比较即可。

### PureComponent和memo

- PureComponent会帮助我们隐式实现一个shouldComponentUpdate的浅比较。

  ```jsx
  // 不再是继承React.Component而是React.PureComponent
  class MyComponent extends React.PureComponent {
    ...
  }
  ```

- memo默认情况下帮助函数组件实现浅比较

  ```jsx
  const areEqual = (prev, next) => {
    /*
    如果把 nextProps 传入 render 方法的返回结果与
    将 prevProps 传入 render 方法的返回结果一致则返回 true，
    否则返回 false
    */
  }
  
  const MyComponent = React.memo(()=>{
  	...
  }, areEqual)
  ```

  不传递第二个参数，默认帮助浅比较，传递第二个参数，自行比较，但是memo和shouldComponentUpdate的返回值相反，memo是返回true不渲染，而shouldComponetUpdate是返回false不渲染。

## HOC

高阶组件，联想到JavaScript语言中高阶函数这个设计，实际上是相当于一个工厂模式。

高阶组件是一个接受组件作为参数并且返回组件的函数。

```jsx
const MyHoc = (Component) => {
  const [name, setName] = useState()
  
  return <Component name={name}/>
}

// 得到一个被注入name props的Component
MyHoc(Component)
```

## React-Redux

单向数据流是Redux中重要的概念，数据的变动必须通过dispatch去触发更新，这点和React的setState类似。

**不可变值**

redux中的数据也是不可变值，这一点和react state相似。

**中间件**

```jsx
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

// thunk是一个可以使得异步dispatch生效的redux中间件，如果需要使用多个中间件用逗号隔开
const store = createStore(reducer, applyMiddleware(thunk))
```

**redux中间件可在执行dispatch之前链式调用，最后返回加工过的action去执行dispatch操作**

## vdom

react中通过**调用React.createElement方法返回vdom**，vdom其实是react中一种对于dom结构的抽象描述，具体表现形式就是一个**JS的对象**，而通过与ReactDOM的配合，真正把vdom表现到dom树上，这一过程称之为`协调`

**为什么需要vdom**

- dom操作昂贵，不可即时高频的直接修改dom
- 方便diff，计算最小化操作dom

**vdom关键要素**

- 标签名
- 标签属性props
- 子元素

当然React的vdom不只这几个属性，比如还有type去标记是一个函数组件还是类组件等等...

## diff

- 只比较同一层级，不跨级比较
- tag不相同，则直接删除
- tag和key都相同，则认为两者相同，不再深度比较

## 合成事件

React采用了合成事件机制。

**优势**

- **兼容**多浏览器下的事件表现形式
- **节约性能减少监听器**的使用
- 方便React事务管理

**流程**

- 真实事件触发，冒泡到document
- react在document监听所有事件，获取真实event
- event对象加工，得到**SyntheticEvent**
- 调用事件绑定的相关回调参数，将SyntheticEvent作为最后一个参数传递

## batchUpdate机制

React会去收集多次setState，合并之后一起更新，这就是batchUpdate

**流程图例**

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1607767574342_0.6497.png)

所以一次setState是否是异步的，取决于是否能命中batch update，命中，则是异步，不命中，则是同步的。

**react在每一次tick周期都会开启batch update**

所以大部分setState都能命中batchupdate， 但依旧有一些异步的回调无法命中batch update， 比如定时器回调，这是因为**定时器的回调脱离了React的事务机制**。

**为什么需要batch update**

一个典型的DEMO

```jsx
function Parent() {
  let [count, setCount] = useState(0);
  return (
    <div onClick={() => setCount(count + 1)}>
      Parent clicked {count} times
      <Child />
    </div>
  );
}

function Child() {
  let [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Child clicked {count} times
    </button>
  );
}
```

如果没有batchUpdate，那么点击子元素后的逻辑是

1. Child (onClick) 触发点击
2. setState 修改 state
3. re-render Child 重新渲染 //   不必要的
4. Parent (onClick) 触发点击（冒泡）
  5. setState 修改 state
  6. re-render Parent 重新渲染
  7. re-render Child 重新渲染 （渲染是自顶向下的，父组件更新会导致自组件更新）

**强制开启batch update**

使用react-dom的unstable_batchUpdates强制开启batch update。

```jsx
import { unstable_batchedUpdates } from 'react-dom'

setTimeout(
	unstable_batchedUpdates(() => {
		this.setState({ a: Math.random() });
		this.setState({ a: Math.random() });
	}
))
```

## 事务机制

react中的事件回调函数，生命周期函数在执行过程中，都会经过事务机制包装执行。

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1607768049024_0.4110.png)


可以在看图了解到，方法在执行的时候，会在方法执行前和方法执行后插入两个函数，分别是initialize以及close，initialize可以注入内容，比如isBatchUpdate。

## 组件渲染和更新

**渲染**

1. 执行React.createElement
2. 运行获取state并反馈出当前tick的值
3. 最后根据state形成vdom
4. 通过ReactDOM渲染到浏览器

**更新**

1. setState触发更新，获取dirtyComponent
2. 根据dirtyComponent形成vdom
3. diff比较，计算最小渲染量
4. 通过ReactDOM渲染到浏览器

## fiber

fiber机制在于提高React性能，减少浏览器卡顿而生。

主要利用的是`window.requestidlecallback`这个API，在浏览器渲染空闲的时候进行JS计算。

React在diff阶段，将其diff过程拆分成N个小任务，依次去调用`window.requestidlecallback`，这样diff算法过程中就不会阻塞DOM渲染，减少卡顿的发生。