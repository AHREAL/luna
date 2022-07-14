---
title: Redux以及React-Redux
date: 2019-10-01 20:58:01
updated: 2019-10-01 22:00:02
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/redux.webp
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/redux.webp
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

Redux在React项目中的部署与使用

## Redux

Redux是一个集中状态管理的库， 本身与React并无太大关联。

### 基本流程

![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589212214700_0.4395.png)

**React Component：**react组件，是redux的使用者，获取redux值或者修改redux的值

**Store：**Store对象，数据仓库，组件需要获取或者修改数据需要通过store对象。

**Reducers：**负责数据的操作，定义Action的type对应的操作，定义数据仓库默认的初始值。

**Action Creators：**数据操作action，类似一个工单，组件如果需要修改redux的数据，需要创建一个action，action声明type和value，交给store去操作数据



### 安装部署redux

1. 下包

```
npm install redux -S
```

2. 创建store文件夹

3. 创建index.js

```javascript
import {createStore} from 'redux'

import reducer from './reducer.js'

let store = createStore(reducer)

export default store
```

4. 创建reducer.js

```javascript
let defaultData = {

}

function reducer(state=defaultData,action){

return state
}

export default reducer
```

   



### 使用流程

**取值：**组件引入store对象，调用store对象的getState方法获取当前的数据仓库。

```javascript
let storeData = store.getState()
```

**改值：**事先在reducer文件声明相应action type对应的处理方式，组件创建一个Action工单对象，调用store对象dispatch方法处理，如果我们需要监听值的变化的话，我们需要调用一下subscribe并且传递一个回调

1. 在reducer文件里面声明处理方式

```javascript
let reducer = (state=defaultData,action)=>{
    if(action.type==='addNum'){
        //深拷贝一个state，在拷贝的state上面对值进行操作
        let newState = JSON.parse(JSON.stringify(state))
        newState.Num += action.value
      //最后要返回这个新的state
        return newState
    }
    return state
}

export default reducer
```

2. 在component组件里面制作一个工单，并且指派给store去处理

```javascript
import store from '...'

addNum(){
    //创建一个action工单
let action = {
        type:'addNum',
        value:10
    }
    //调用store的dispatch方法提交工单
    store.dispatch(action)
}
```

3. 一般在constructor调用store的subscribe方法，监听store的变化

```javascript
import store from '...'

constructor(props){
    super(props)
    //订阅redux的数据变化，当数据变化的时候会执行传递的回调
    store.subscribe(this.handleStoreChange.bind(this))
}

handleStoreChange(){
    //一旦被执行了，就意味着redux数据变化了，需要重新获取一下
    let storeData = store.getState()
    ...
}
```



### 订阅以及退订

**订阅：store.subscribe(fn)：**订阅store数据变化，当store的数据发生改变的时候，自动执行传入的回调。

**退订：**当调用store.subscribe去订阅store数据变化的时候，会返回一个退订的方法，我们只需要保存这个方法，在需要退订的时候调用一下即可。

**退订操作一定要在组件销毁前执行一下，**因为React中路由组件的切换是组件不断的构建-销毁的过程，这时候如果没有退订的话，每次切换来回一次组件，就会创建一次组件，执行一次constructor方法，就会订阅一次（我们一般把store.subscribe方法的调用放置在constructor中），**一直重复订阅的话会造成内存泄漏，**最后导致内存溢出



**正常订阅以及退订的操作**

```jsx
import store from '...'

class Mycomponent extends React.Component {
    constructor(porps){
        super(props)
        //调用store.subscribe订阅数据变化，同时将返回的退订方法保存在this上
        this.unSubscribe = store.subscribe(handleChange)
    }
    ...
    componentWillUnmount(){
        //调用一下退订的方法
        this.unSubscribe()
    }
}
```





## React-Redux

首先你要明白的事情是，redux并不是专门为react服务的，他的运作完全不需要react，redux和其他第三方框架配合一样可以使用。

react-redux是对redux的一种扩充，能提高redux在react的性能，并且能够使代码更加的优雅。

react-redux依赖于react以及redux，所以使用react-redux之前，是基于你react以及redux已经安装完成。

### 安装以及使用

首先你应该先完成redux的安装并且部署好store以及reducer，参考笔记上面redux的安装部署。

1. 下载 react-redux

```shell
npm install react-redux -S
```

2. 在main.js使用react的context特性注入store

```jsx
import store from './store/store.js'

//导入react-redux的Provider
import {Provider} from 'react-redux'

//注入store
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById('root')
)
```

3. 在组件里面导入connect

```jsx
import { connect } from 'react-redux'
```

4. 声明两个注入props的属性和方法

```jsx
//这里的参数state是个默认参数，这里的参数state指的是store的state，而不是组件自身的state
let mapStateToProps = state=>{
  return{
          //写属性
  }
}

let mapDispatchToProps = dispatch=>{
  return{
    //写方法
  }
}
```

5. 使用connect修饰组件并导出组件

```jsx
//connect接收两个参数，是上面定义的两个方法，connect返回一个方法，方法接收组件本身作为参数
export default connect(mapStateToProps,mapDispatchToProps)(MyComponent)
```



### 与只使用redux的区别以及优点

- 无需在组件文件里面导入store
- 无需调用subscribe来监听数据变化，自动监听
- 如果组件是无状态组件（没有自己的state），那么组件可以直接改成使用function声明（之前只使用redux，由于redux的state需要在组件的constructor里面去获取，所以只能使用class的形式去定义组件），改用function声明组件，能提高性能
- 理由同上一点，使得代码更加简洁优雅



## 开发者工具

使用起来和vue dev-tools一毛一样，不过多赘述。

下载链接：https://pan.baidu.com/s/1Iq-J3u-25Gg8uLPaR0OsUg	提取码：f7dg

安装流程：

1. 网盘里面一共有两个文件夹，分别是react开发者工具和redux开发者工具，下载。
2. 下载完成之后，打开chrom菜单，更多工具，扩展程序。
3. 右上角又一个开发者模式，请打开。
4. 打开开发者模式以后，选择左上角加载已解压的扩展程序，选择刚才下载的两个文件夹就OK。



**注意，redux的开发者工具不是开箱即用，需要在代码里面，创建store的时候加上一句**

```javascript
//原本只传递一个参数reducer，现在多传递一个参数，复制过去即可。
let store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
```