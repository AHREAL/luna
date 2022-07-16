---
title: React使用指南
date: 2019-9-16 20:58:01
updated: 2019-11-21 12:29:02
tags: React
categories: 框架技术
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/react.svg
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/react.svg
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

全面React16.8相关特性使用

**和Vue一样，React先从js文件引入形式进行开发学习**

- 引入三个文件

```html
<!-- babel，用于编译JSX语法 -->
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
<!-- react -->
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
<!-- react-dom -->
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

- 创建script标签

```javascript
//script标签的type要为text/babel，因为这里需要babel来解析JSX语法
  function MyFirstComponent(props){
    return(
      <h1>我是tom,这是我创建的第一个react组件</h1>
    )
  }
  
  //调用ReactDOM.render方法，渲染组件
  ReactDOM.render(<MyFirstComponent/>,document.getElementById('root'))
```

- 创建一个用来渲染React的标签

```html
<div id="root"></div>
```

- 运行即可，下面贴出根据上面的步骤写的完整HTML代码

```html
<!DOCTYPE html>
  <html>
	<head>
  		<meta charset="utf-8">
		<title>StudyReact</title>
  	</head>
  	<body>
  		<div id="root"></div>
  		
  		<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  		<script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  		<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js">			</script>
  		<script type="text/babel">
  		    function MyFirstComponent(props){
  		        return(
  		            <h1>我是tom,这是我创建的第一个react组件</h1>
  		        )
  		    }
  		    
  		    //调用 ReactDOM.render 方法
  		    ReactDOM.render(<MyFirstComponent/>,document.getElementById('root'))
  		</script>
  	</body>
  </html>
```



## JSX语法

	**和vue的单文件.vue有点不同,jsx语法只是将组件的结构（html）和行为（js）整合到一起，没有将表现(css)整合到一起来，css还是采用引入的形式**

- 可以直接写HTML语法：

```javascript
let ele_obj = <div>hello world</div>
//这里比较离谱的事情是，这里的结构代码不需要加''引号
//以前我们常用的的做法是将html结构写成字符串的形式，再使用dom对象的innerHTML进行解析。
```

​    

- JSX插值表达式使用单花括号，区别于vue使用胡子双花括号

```jsx
let name_str = 'ahreal'
let ele_obj = <div>my name is <span>{name_str}</span> </div>
```

​    

- 使用单标签一定要加 /

```jsx
let ele_obj = <img src="..." />
```



- 使用class要使用className

```jsx
let ele_obj = <p className="name">ahreal</p>
```

​    

- 使用行内样式style直接用对象的形式插入 

```jsx
let ele_obj = <div style={{'color':'red','fontSize':'20px'}}>hello,world!</div>
//1.这里插入的是以对象的形式进行插入，所以这里用了双大括号，第一个括号是插值语法，第二个括号是对象的括号
//2.写样式的时候，如果遇到连接符号font-size这类应该改成驼峰形式fontSize
//3.中间使用逗号,隔开 ，注意区分html里面是用分号;隔开
//4.强调外层不要有''引号这些东西，直接两个大括号{{}}
```

​    

## 组件定义方式

**组件名首字母需要大写**

### 通过函数定义

```jsx
function person(props){
     return <div>hello,{props.name}</div>	{/* 函数定义组件返回的必须是一个jsx对象 */}
}
```



### 通过类定义

如果通过类的方式去定义组件，那么组件必须继承于React.Component这个类

```jsx
class person extends React.Component{
    //必须定义一个render方法，
    render(){
        {/* 也是必须返回一个jsx对象 */}
        return <h1>hello,{this.props.name}</h1> 
    }
    //也可以定义组件的类的方法
    sayName(){
        console.log('我的名字是'+this.props.name)
    }
}
```

类定义不需要写props这个形参，因为props是继承React.Component来的，只需要this.props即可访问



## 事件绑定

- 直接在渲染的jsx对象标签上进行绑定，需要写成驼峰的形式

  比如：onclik 写成 onClick

- 事件处理的function直接写成类的方法

- 事件处理funciton内部如果需要访问this（组件本身）的话，直接访问是undefined

  解决方案：

  - 在绑定事件处理函数的时候使用bind明确this指向

```jsx
class MyCom extends React.Component{
    render(){
        //这里在调用的时候使用bind
        return <div onClick={this.handleClick.bind(this)}>这是一个自定义组件</div>
    }
    
    handleClick(){
        console.log('我被点击了'+this.props.message)
    }
}

ReactDOM.render(<MyCom message="ahreal"/>,document.getElementById('root'))
```

  - 使用箭头函数

```jsx
class MyCom extends React.Component{
    render(){
        return <div onClick={this.handleClick}>这是一个自定义组件</div>
    }
    //使用箭头函数去定义事件回调
    handleClick=()=>{
        console.log('我被点击了'+this.props.message)
    }
}
```

- 事件传参

  - 使用bind传参(不可直接传参，否则会立即调用)

```jsx
onClick = {this.handleClick.bind(this,arg1,arg2...)}
```

  - 如果不使用bind,那么就需要再包一层箭头函数

```jsx
onClick = { ()=>{this.handleClick(arg1,arg2)} }
```

  

**注意点：**

- 无法通过事件处理函数return false来阻止默认行为，必须使用e.preventDefault()







## 组件状态state

### 创建state

如果需要定义组件的自定义属性，在组件的 **constructor** 构造函数里面去定义state

```jsx
class Mycom extends React.Component {
    constructor(props){
        super(props)
        //给this.state赋值一个对象，对象的属性就是组件的自定义属性
        this.state = {
            iNum:10
        }
    }
}
```

### 修改state

不能直接去修改state的值，否则数据无法驱动关联，需要使用 **setState**

setState方法可以接收两个参数，第一个参数为一个对象，类似于小程序原生的setData，第二次参数下面会说。

setState方法是一个异步的方法

```jsx
this.setState({
	iNum:12
})
```

setState方法也可以接收参数为一个函数，**函数的第一个参数为state**，**第二个参数为props**

```jsx
this.setState(function(state,props){
	return {iNum:state.iNum+1}
})

//可用箭头函数简写成
this.setState(state=>({iNum:state.iNum+1}))

```

```javascript
//补充一下箭头函数
function(state){
	return {iNum:state.iNum+1}
}
//先去掉function关键字，加上go's to =>
(state)=>{
	return {iNum:state.iNum+1}
}
//因为只有一个参数，接收参数的（）可以省略
state=>{
	return {iNum:state.iNum+1}
}
//因为函数内部直接是返回值，所以函数体可以省略return 并且省略{}
state=>{iNum:state.iNum+1}
//因为返回值是一个对象，对象本身的{}会被理解成函数体的{}，所以需要再包一层()
state=> ({iNum:state.iNum+1})
```

**当使用函数的形式去传参的时候，可以解决一些由于异步所带来的麻烦的问题**



**注意：**

**setState不要依赖this.state或者 this.props等值**，因为react会将多个state和props值的变化合并成一起去执行来提高性能，所以如果我们在setState里面具有依赖的话，那么会带来一系列麻烦。

我们使用setState传递一个函数，函数默认有state和props两个形参，利用这两个形参去访问的话，就不会产生问题。



**另外，setState可以接收的第二个参数为一个回调函数**

经过上面的介绍大家都知道setState设置值是一个异步操作，如果我们需要在设置完state之后做一些逻辑操作，我们可以给setState传递第二个回调形式的参数。

像下面这样。

```javascript
this.setState({
	name:'ahreal'
},()=>{
	console.log('state值修改成功，现在的name值为'+this.state.name)
})
```



## 列表渲染

在React中，列表渲染使用数组的map方法，列表渲染需要使用key

```jsx
let myArr = ['jack','allen','ahreal']

class MyCom extends React.Component{
    render(){
        return (
        	<ul>
            	{
                    myArr.map((item,index)=>{
                        return <li key={index}>{item}</li>
                    })
                }
            </ul>
        )
    }
}
```





## 条件渲染

两种方式做条件渲染

- 使用 **if-else**

  - 直接返回jsx对象

```jsx
class LoginState extends React.Component{
  render(){
      {
      if(this.props.isLogin){
        return <p>已经登录</p>
      }else{
        return <p>未登录</p>
      }
    }
  }
}
```

  - 返回不同的子组件

```jsx
function Login(){
  return <p>已经登录</p>
}

function Loginout(){
  return <p>未登录</p>
}

class LoginState extends React.Component{
  render(){
      {
      if(this.props.isLogin){
        return <Login></Login>
      }else{
        return <Loginout></Loginout>
      }
    }
  }
}
```

​    

- 使用 **&&**

```jsx
class Notice extends React.Component{
	
	render(){
		let {username,message} = this.props
		
		{
			return (
				<div>
					<p>欢迎您,{username}</p>
					{message.length&&<p>您有{message.length}条信息</p>}
				</div>
			)
		}
	}
}
```



**如果你想行为和结构区分得更彻底，那么你可以使用变量去保存jsx对象**

比如：

```jsx
function Login(){
    return (
    	<button>登录</button>
    )
}

function LoginOut(){
    return(
    	<button>注销</button>
    )
}

class LoginButton extends React.Component {
    render(){
        let isLogin = false
        let btn
        if(isLogin){
            btn = <LoginOut></LoginOut>
        }else{
            btn = <Login></Login>
        }
        
		return (
        	<div>
            	<h1>登录状态</h1>
                <btn></btn>
            </div>
        )
    }
}
```



**如果你想阻止一整个组件的渲染，那么你return null即可**





## 双向绑定

React中没有帮我们封装类似vue中的V-model

所以我们需要自己去封装双向绑定

**React对于绑定了state数据的表单组件称为受控组件**

简单的实现步骤：

1. 初始化默认的数据

```jsx
constructor(props){
  super(props)
  this.state = {
      //初始化了一个message,message作为双向绑定的数据媒介
    message:this.props.message
  }
}
```

2. 给输出绑定message

```jsx
render(){
  return (
      <div>
        <p>{this.state.message}</p>
      </div>
  )
}
```

3. 给输入绑定message，并且绑定change事件

```jsx
render(){
  return (
    <div>
      <p>{this.state.message}</p>
      <input value={this.state.message} onChange={this.changeMessage.bind(this)}/>
    </div>
  )
}
```

4. 声明changeMessage方法，去动态修改state

```jsx
changeMessage(e){
  let newValue = e.currentTarget.value
  this.setState(()=>({message:newValue}))
}
```

   

## Ref的使用

和vue一样，React可以使用ref去标记某个dom对象，然后进行操作

**使用步骤：**

1. 在constructor构造函数中创建一个ref对象

```jsx
constructor(props){
  super(props)
  this.myRef = React.createRef()
}
```

2. 在render中使用ref标记dom

```jsx
render(){
  return(
    <input ref={this.myRef}/>
  )
}
```

如此便可讲我们需要的dom使用ref标记了

**当我们需要使用的时候可以通过**

```jsx
this.myRef.current
```

如此去拿到对应的ref所标记的dom





## 概念：受控组件和非受控组件

- 受控组件

  组件的数据有和state进行关联的叫受控组件

- 非受控组件

  组件数据没有和state进行关联的叫非受控组件





## 概念：有状态组件和无状态组件

- 通过有无state来判断是否是有状态组件
- 通过function定义的组件都是无状态组件，通过class定义的组件可以是有状态组件，也可以是无状态组件





## 生命周期

### 图示

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589212353205_0.2057.png)

http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

### 文字说明

**constructor**

构造函数，在组件初始化的时候会执行

**render**

这个方法会在componentWillMount方法之后执行，也会在state和props的数据发生变化的时候执行，所以这个方法在组件开始会执行，组件中途也会执行

**componentDidMount**

方法在组件挂载在页面之后执行

**componentDidUpdate**

组件更新之后执行

**componentWillUnmount**

在组件销毁之前执行

**shouldComponentUpdate**

在组件更新之前执行，这个方法可以决定组件是否更新，renturn true更新 false不更新。

如果返回true 组件会进入componentWillUpdate，然后进入render方法，接着进入componentDidUpdate方法


## 传值

### 父子之间

- 父传子

  父组件在引用子组件的时候通过行内属性的形式直接传递，子组件通过this.props.属性名去获取传递过来的值

  **注意，这里和Vue一样，具有单向数据流的概念，不可以直接修改由父组件传递过来的props属性**

- 子传父

  父组件在自身声明一个接收数据的方法，将这个方法通过行内属性的形式传递给子组件，子组件接收这个方法调用，通过方法传参的形式传值

### 兄弟之间(bus模式)

- 使用react内部模块events中的EventEmitter类实例化一个bus对象，通过发布订阅的模式传值，组件中通过bus.emit来触发自定义事件，接收数据的组件通过bus.on来监听事件。


## 插槽

官方不叫他插槽，官方叫他**组合**。

我认为他和效果和Vue中插槽的概念非常接近，而且插槽的话对于这一块的知识点的描述更加形象。

### 用法

React的props可以传递一个JSX对象，通过{this.props.XX}去使用外层传递进来的JSX对象

```jsx
//定义一个我们即将传递进来的子组件
function hello(props){
    return <h1>Hello world</h1>
}

//定义一个props接受子组件的组件
class MyComponent extends React.Component{
    render(){
        return(
        <div>
      		<h1>你好世界</h1>
            {this.props.children}
        </div>
      )
    }
}

//使用props将子组件传递进去
ReactDOM.render(<MyComponent children={<hello/>} />, document.getElementById('root'));
```





## 代码分割（待补充）

React的懒加载

1. **动态 import( )** 
2. **React.lazy( )**
3. **基于路由**



## Context

Context，翻译过来就是上下文的意思，我们有时候会出现这么一个情况，某一些特定的状态，我只想在一个组件树上共享，我既不想一层一层向下传值，又不想他是一个全局变量（毕竟其他组件树不需要这些状态），那么Context就是为了解决这个情况设计。



**挂载（生产）**

我们把需要传递下去的值挂载在组件树的最顶端，挂载完以后就可以在挂载点的子孙组件访问



**使用（消费）**

**分为两种情况：函数组件和类组件**

函数组件：

函数组件需通过Context.Consumer获取。

类组件：

类组件重写自身类的contextType，将其指向需要获取值得Context即可。



**使用流程**

- 我们先来创建一个Context对象，这里 **MyContext** 就是一个Context对象

```jsx
const MyContext = React.createContext('ahreal')
```

- 接着我们把Provider挂在我们需要传递特性的组件树最顶端。**（挂载）**

```jsx
<MyContext.Provider>
    <Father>
    <Son></Son>
    </Father>
</MyContext.Provider>
```

- 我们需要取值的时候分两种。**（取值）**

  1. 类组件（假设son组件是一个类组件）

```jsx
class Son extends React.Component{
render(){
        let value = this.context
    }
}
//需要重写类的contextType，当然这个MyContext如果有需要的话要从定义的地方导入
Son.contextType = MyContext
```

  2. 函数组件

```jsx
function Son(props){
    return(
    <MyContext.Consumer>
  {
          value = > (
            <div>
              ...
                </div>
            )       
        }
</MyContext.Consumer>
    )
}
```







## 概念：React中的副作用操作

数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用。

一般说到函数的副作用指的是，函数体内部做了一些和参数返回值无关的操作，比如说访问全局变量，修改全局变量等等一些和本函数无关的操作称为函数的副作用。



## Hook

Hook是React16.8新推出的一个特性，可以在使用function定义组件的时候，使用state等其他react的特性。

Hook是一种渐进策略，也就是说即使你的项目之前没有使用hook，你完全可以选择使用或者不使用hook，

Hook不可以在class组件中使用。

### useState

这就是一个hook，能够帮助你在function组件定义State。

像这样:

这是一个计步器，每次点击button的时候count这个state属性++

```jsx
//导入React使用默认导入，useState使用的是具名导入，这个和react封装的暴露策略有关。
import React,{ useState } from 'react'

function Example() {
  // useState本身是一个方法，方法接收一个参数，方法返回一个数组，使用解构赋值的形式接收并且声明。
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

我们来具体讲一下 **useState**

useState本身是一个方法，方法接收一个参数，**这个参数作为我们要定义的 state的初始值**。

比如说我们:

```jsx
//这里是es6的解构赋值特性
const [count, setCount] = useState(0);
```

等价于你在class组件中：

```jsx
constructor(props){
	super(props)
	this.state:{
        count:0
    }
}
```

那么这个setCount是什么呢？setCount是用来修改Count这个State的方法。

比如说我们这样：

```jsx
setCount(20)
```

等价于你在class组件中：

```jsx
this.setState({
	count:20
})
```

我们使用hook的setCount和React自带的setState区别在于，setState是合并state，和setCount是替换值，毕竟setCount只为一个state服务。

这个设置state初始值，和调用方法修改state并不难。

当然如果你有多个state，那么你只需调用多次useState即可。



### useEffect

useEffect这个Hook使你的function组件具有生命周期的能力！能够使用componentDidMount，componentDidUpdate，componentWillUnmount这三个生命周期函数。

**最基本的使用useEffect**

我们在上一个例子的计步器的基础上，将Count绑定到浏览器title。

```jsx
import React,{ useState,useEffect } from 'react'

function Example() {
  //这里最好使用const来做声明关键字，防止我们意外直接修改state而没有通过set方法去设置。
  const [count, setCount] = useState(0);
  
  //useEffect方法接收一个参数，参数为一个函数，这个函数会在Dom渲染的时候调用，包括第一次渲染。
  //这里useEffect接收的函数在react中称为副作用函数。
  useEffect(()=>{
      document.title = `你点击了${count}次！`
  })

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**下面我们再进行与Class组件类比：**

比如你这样去写useEffect这个hook

```javascript
useEffect(()=>{
      document.title = `你点击了${count}次！`
})
```

在Class组件中等价于：

```jsx
//组件挂载到页面上后的生命周期钩子
componentDidMount(){
	document.title = `你点击了${this.state.count}次！`
}
//组件State更新之后的生命周期钩子
componentDidUpDate(){
	document.title = `你点击了${this.state.count}次！`
}
```

这里useEffect将两个生命生命周期合二为一了，简化了代码，但同时也限制了逻辑代码的灵活性。

对于此，React官方文档给到的解释是：

> 注意，**在这个 class 中，我们需要在两个生命周期函数中编写重复的代码。**
>
> 这是因为很多情况下，我们希望在组件加载和更新时执行同样的操作。从概念上说，我们希望它在每次渲染之后执行 —— 但 React 的 class 组件没有提供这样的方法。即使我们提取出一个方法，我们还是要在两个地方调用它。



**使用useEffect实现componentWillUnmount**

上面只介绍了如何实现componentDidMount，componentDidUpdate，那如何实现componentWillUnmount这个生命周期呢？

在**副作用函数**中返回一个函数即可，返回的这个函数就是componentWillUnmount。

```jsx
useEffect(()=>{
      document.title = `你点击了${count}次！`
      
      let UnmountFn = ()=>{
          alert('组件被卸载了！')
      }
      return UnmountFn
})
```

返回的这个函数只有在组件卸载的时候才会被执行。 



**性能优化**

在class组件中，componentDidUpdate在每次数据发生改变的时候都会被执行，我们常用一个判断需要的值的改变来节约性能，就像这样：

我们需要在name值发生改变的时候重新赋值给fullname

```jsx
componentDidUpdate(prevProps,prevState){
	//当发生改变的值是state的name的时候，才继续往下执行
	if(prevState.name != this.state.name){
		this.setState((state)=>{
			return {
				fullname:'黄'+ state.name
			}
		})
	}
}
```

在effect中，我们可以通过第二次参数的形式决定这个hook执行与否

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

```jsx
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅
```



**更加准确的理解**

我们上面类比class组件的生命周期来解释useEffect的作用，方便理解，但是我个人认为还不够准确。

- class组件的componentWillUnmount是在组件卸载的时候执行，而上文将其类比的useEffect返回值函数是在state每次发生改变的时候都会执行，只不过是在Hook挂载的时候不会执行。
- 观察的点不同，组件挂载我认为和Hook挂载不同，即使componentDidMount和useEffect在看起来貌似是同一时刻执行，componentDidMount观察的是组件的DOM挂载，而useEffect观察的是State创建或者更新（从另外一个维度理解，state创建和更新本质上都是赋值。）





### Hook的使用规则

从官方文档搬来的，我觉得总结的很好。

- 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中，我们稍后会学习到。)



### 自定义Hook

我们可以将一些相同的逻辑抽离出来，注入组件中。

**自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。**

一个自定义的Hook例如：

```jsx
import React, { useState, useEffect } from 'react';
//这是一个可以通过friendID去判断是否在线的自定义Hook
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });
  //这里只是返回了isOnline这个属性，当然你连setIsOnline也可以返回出去，可以让组件调用的时候接收这个方法，在必要的时候自行修改Hook的State
  return isOnline;
}
```

自定义Hook看起来特别的像一个函数的使用，传递一个参数，得到一个结果。

定义Hook和函数不同的是，Hook可以利用起生命周期钩子，以及有Hook内部自己的数据。

**注意：自定义Hook每次调用的时候会创建一个新的State作用域（如果你有使用useState的话），所以不用担心多次调用Hook导致State互相影响**

**自定义Hook服用逻辑，但不服用State，作用域还是独立的**



如何在组件中使用这个自定义Hook呢？

```jsx
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

用一个变量保存即可，无需Hook关心内部的逻辑，内部帮你绑定了生命周期，帮你创建State作用域，这些你都不用关心，直接用即可。