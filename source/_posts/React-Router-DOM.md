---
title: React-Router-DOM
date: 2019-10-02 09:31:01
updated: 2019-10-02 10:00:02
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/react-router-dom.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/react-router-dom.png
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

React项目中路由的部署以及使用

## react-router-dom

### 安装

1. 下包

```shell
npm i react-router-dom -S
```

2. 导包

```javascript
import {HashRouter,Link,Route,Switch,Redirect} from 'react-router-dom'
```

   其中：

   - HashRouter定义哈希路由整体的容器组件
   - Link单个标签，定义路由的链接，通过to属性来定义链接的地址
   - Route单个标签，定义组件的容器标签，通过path定义和Link的to属性对应的地址，component属性定义链接对应的组件
   - Switch多个Route标签外面的容器标签，如果需要定义404跳转和重定向跳转，需要用此标签包裹Route标签
   - Redirect定义路由的重定向，通过from属性定义原始路由，通过to属性定义重定向路由



### 基本用法

react的路由直接在需要写router-view的页面引入即可

```jsx
import {HashRouter,Route,Link} from 'react-router-dom'

class MyRouter extends React.Component {
	render(){
		return(
            //HashRouter包裹在最外层作为路由组件的根组件
			<HashRouter>
                //Link组件就是一个a标签，to定义链接的地址
				<Link to="/">router1</Link>
				&nbsp;&nbsp;
				<Link to="/router2">router2</Link>
				&nbsp;&nbsp;
				<Link to="/router3">router3</Link>
				&nbsp;&nbsp;
				<hr/>
                //Route就是一个表明链接对应的组件，同时表示路由组件渲染的位置,exact字段表示精准匹配
				<Route path="/" exact component={router1}></Route>
				<Route path="/router2" component={router2}></Route>
				<Route path="/router3" component={router3}></Route>
			</HashRouter>
		)
	}
}
```

exact表示这个Route是精准匹配的，react的路由默认是模糊匹配。

### 404页面

两步走

1. 最末尾写一个Route标签，不写path属性，表示任意路径都能匹配上

```jsx
<Route path="/" exact component={router1}></Route>
<Route path="/router2" component={router2}></Route>
<Route path="/router3" component={router3}></Route>
<Route component={Page404}></Route>
```

   

2. 外部包裹一层Switch组件，表示从上到下匹配，只能匹配一个路由

```jsx
<Switch>
  <Route path="/" exact component={router1}></Route>
  <Route path="/router2" component={router2}></Route>
  <Route path="/router3" component={router3}></Route>
  <Route component={Page404}></Route>
</Switch>
```



### Redirect重定向组件

接收一个to和一个from

```jsx
<Redirect from="/" to="/page1"></Redirect> 
```



### 路由嵌套

直接在路由里面写路由子组件即可，当路由里面嵌套路由的时候，最外层不需要再包HashRouter



### 动态路由传值与取值

和Vue-router的动态路由一样，在定义路由path的时候使用**: 冒号** 。

取值方式根据组件的形式分两种：

**步骤：**

**函数组件:**

1. 实现在路由的path声明参数，类似于函数的形参

```jsx
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";


function MyComponent(props){
    return (
    <Router>
            <Switch>
                //这里跳转的形参
            <Route path="/:id" component={<Child/>}></Route>
            </Switch>
        </Router>
    )
}
```

2. 跳转的时候在url对应位置写值

```jsx
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";


function MyComponent(props){
    return (
    <Router>
            //跳转的url直接在对应位置写参数
            <Link to="/ahreal">点我传递ahreal</Link>
        <Link to="/allen">点我传递allen</Link>
            <Switch>
                //这里跳转的形参
            <Route path="/:name" component={<Child/>}></Route>
            </Switch>
        </Router>
    )
}
```

3. 对应的组件内通过useParasm获取参数

```jsx
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

function Child(props){
    //对应组件里面使用useParams取参数
    let {name} = useParams
    return (
    <div>传递过来的参数是:{name}</div>
    )
}
```

**类组件**

```jsx
this.props.match.params.参数名
```



### 自定义路由(路由守卫)

我们上面说到Route组件可以接收一个Component组件，当path匹配上的时候，这个Route组件就会被渲染出来。我们还可以在路径匹配之后做一点事情，这一点类似于Vue中的路由守卫。



用到的还是Route这个组件，只不过这次组件不通过Component去传递数据，通过 **render** 属性。

```jsx
import {Route} from 'react-router-dom'

function Custom(){
    return (
    	<Route path="/index" Render={()=>{
                //isLogin判断用户是否登录，如果登录了渲染首页，没有登录渲染登录
               	if(isLogin){
                   return <Index></Index>
                }else{
                   return <Login></Login>
                }
            }}/>
    )
}
```

还有一种常见的情况，使用 **children** 属性去帮我们做匹配渲染



**匹配渲染**

假设我们这里有个需求，我们要做一个按钮，处于index页面的时候，首页按钮高亮

```jsx
import {Route} from 'react-router-dom'

function Custom(){
    return (
        //match为一个布尔值，由Route默认传入，告知匹配结果。
    	<Route path="/index" children={({match})=>{
                return(
                    //当匹配成功的时候，添加类名active高亮，否则移除active
                    <Button className={ match ?'active':'' }>首页</Button>
                )
            }}></Route>
    )
}
```



### 编程式导航

**首先要知道，组件分为路由组件和非路由组件**

- 路由组件，包裹在Router里并且经过匹配渲染出来的，称为路由组件
- 非路由组件，不是Router匹配渲染的。

**区别**

- 路由组件可以直接从this.props.history上拿到history
- 非路由组件无法直接拿到history，需要配合withRouter

#### 实现步骤

- 路由组件：

```jsx
//组件方法内部直接获取history
jump(){
  this.props.history.push(url)
}
```

- 非路由组件：

```jsx
//引入withRouter
import { withRouter } from 'react-router-dom'

//正常定义组件
class tabBar extends React.Component{
    render(){
        return (
          <ul>
              <li onClick={this.handleClick.bind(this,'/home')}>首页</li>
                <li onClick={this.handleClick.bind(this,'/cate')}>分类</li>
                <li onClick={this.handleClick.bind(this,'/home')}>个人中心</li>
            </ul>
        )
    }
    
    handleClick(url){
        //如路由组件一样直接使用this.props.history
        this.props.history.push(url)
    }
}

//暴露的时候需要使用装饰者设计模式使用withRouter包裹一下组件,注意，一定要是最外层
export default withRouter(tabBar)
```