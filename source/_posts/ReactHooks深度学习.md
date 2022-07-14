---
title: ReactHooks
date: 2020-08-05 14:32:01
updated: 2020-09-01 20:02:20
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.cos.ap-guangzhou.myqcloud.com/upload/react-hooks.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.cos.ap-guangzhou.myqcloud.com/upload/react-hooks.png
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

一些关于使用Hooks开发时候的遇到的坑和经验总结。

## 前言

经过大概半年ReactHooks实践，发现其实Hooks在项目中的开发过程并不是那么流畅，项目质量不佳，很多认为是细小的事实在Hooks上不断打脸，留步总结其实是主要问题在于

- Vue思想带到了React上，试图模拟 watch, filter，emit 等一系列React不存在的概念。
- 想通过Hooks完整还原类组件实例的效果，但其实函数组件的思想与类组件思想是不同的。
- 想通过Hooks还原类实例生命周期的概念。
- 单个Hooks组件过于复杂化，导致复用性差。
- 没有很好的发挥自定义Hooks带来的逻辑抽离的便利性。
- 没有深入理解纯函数开发概念。
- 并没有很深入的去理解ReactAPP的设计哲学，未磨刀先砍柴。

这次深入Hooks细节，从头学习一次ReactHooks。

没有太多要学的东西。事实上，我们需要花费大部分时间去**忘记已学习的东西**，实际上是一件挺困难的事情。



在此之前，仔细阅读并消化：[React哲学](https://react-1251415695.cos-website.ap-chengdu.myqcloud.com/docs/thinking-in-react.html)

## 写在前面

**Hooks组件不是类组件的语法糖，其React内部实现逻辑是不同的。**

关于函数组件的**生命周期**， 没有类组件那么复杂，只是简单的挂载，卸载。

每次组件刷新都是一次 **卸载 -> 挂载 **的过程

挂载 -> 卸载 -> 挂载 -> 卸载

在函数组件内，**实例**与**vdom**其实是两个不同的概念

可以认为的是，每个组件实例始终一致（只要组件不被**销毁**），每次刷新会产生不同的`vdom`，但是实例始终保持不变。



**销毁**

组件彻底在你的ReactAPP消失，这称为实例的销毁，组件的`state`所占用的内存空间会被回收。

那么组件在什么时候会被销毁呢？组件被条件渲染给pass掉了。

```jsx
return show ? <Children/> : null
```

**卸载**

组件并没有消失，只是组件的`state` 发生改变，组件被重新渲染了，重新渲染的过程就是一次 **卸载 -> 挂载** 的过程。

那么组件在怎么时候卸载呢？组件状态更新重新挂载之前，或者组件实例销毁之前。



**实例这个概念是React通过Hooks赋予函数组件的，在这之前函数组件只是无状态视图组件，而我们把React保存函数state，ref的内存空间称为函数组件实例**



**组件到底是依赖props才更新还是自身的state?**

- 只依赖自身的state，你可以认为组件的props其实是父组件的state。

其实很容易误区的是，并不是一且props改变都会引发重新渲染。

```jsx
function ChildrenComponent(props){
  return (
    <div>
      <p>{props.count}</p>
    </div>
  )
}

let count = 0
setInterval(()=>{
  count ++
  console.log(count)
},1000)

ReactDOM.render(
  <ChildrenComponent count={count}/>,
  document.getElementById('app')
)
```

可以观察到，`ChildrenComponent` 的props一值在改变，控制台不断打印最新的`count` 值， 但是组件却不会刷新。

- 其实React并不会帮助我们去监听`props`的变化，只有`setState`的调用，才会导致React去帮助我们刷新。
- 子组件props改变的刷新是由于父组件刷新引起，这其实是两个概念，很容易形成误区。
- React不存在**监听**的概念，这是Vuejs的概念。





## useEffect

表面当前组件**渲染完成包括DOM挂载**，需要执行的**副作用操作**。

**不要尝试用生命周期的方式去理解useEffect，这会使得事情变得十分复杂**

接收两个参数，一个是回调函数，一个是依赖数据。

- 回调函数effect，表明需要执行的函数操作
- 依赖数据，数组，表明所依赖的数据变化，只有当数组中的数据发生了改变，才会执行effect函数

React 将按照 effect 声明的顺序依次调用组件中的每一个 effect

**时机**

1. 组件首次挂载完成 
2. 执行 `effect` 
3. 组件状态改变 ，即将卸载
4.  执行`effect`返回值函数
5. 组件重新挂载完成
6. 执行 `effect`
7. 组件卸载
8. 执行 `effect` 返回值函数
9. 实例销毁

**流程**

effect->effect返回值函数->effect->effect返回值函数

**副作用**

指的是函数影响了其函数(**effect自身**)作用域之外的数据，比如修改了数据库，修改了浏览器的title等等。

**effect**

effect函数作为Hook组件内部用于处理一系列副作用操作，同时effect可以返回一个函数，React会帮助我们记录它就好像记录你的许多state一样，直到你的组件卸载或销毁了，React会去调用这个返回的函数。

**Capture Value**

函数组件之间存在状态隔离，我们称这个现象为函数的 **Capture Value** ，或者我们称React这种行为叫**按帧渲染**。

假设我们有这么一个`effect`

```jsx
const [ num, setNum ] = useState(1)

useEffect(()=>{
	console.log(num)
}, [num])
```

其实这个effect会被React内部保存成

```jsx
()=>{
	console.log(1)
}
```

这样一看貌似没什么问题，但是如果遇到一些异步的函数比如：

```jsx
useEffect(()=>{
	setTimeout(()=>{
		console.log(num)
	},3000)
},[num])
```

我们希望在num发生改变后，组件重新渲染，effect三秒后打印num。

但是在计时器等待的期间，num被修改了多次。

三秒后，计时器打印的是三秒前的num，而期间多次改变的数据依旧会依次打印出来。

这是因为， React内部，`effect` 函数已经被保存成了

```jsx
()=>{
	setTimeout(()=>{
		console.log(1)
	},3000)
}
```

**不要试图去欺骗React**

很多时候我们会在`effect` 函数内部去依赖外部的数据，React官方指出我们需要在`useEffect`第二个数组参数内表明我们在`effect`函数内部所依赖的数据，这是因为`effect`会作为帧的方式进行保存，帧之间的作用域是隔离的，React需要对函数内部的变量转化成常量。

比如我们有这样的代码

```jsx
useEffect(() => {
    const id = setInterval(() => {
        setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
}, []);
```

我们希望effect在组件渲染完毕后只执行一次，在组件销毁时候同时也销毁定时器，但是我们内部依旧是依赖了`count`这个状态。

显然我们这么做有点投机取巧，且这样代码并不会如期运行，count始终会被设置成同一个常量。

那如果我们将count添加进依赖里面。

```jsx
useEffect(() => {
    const id = setInterval(() => {
        setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
}, [count]);
```

- 重复的创建定时器，重复销毁定时器，造成性能浪费。

这貌似得不偿失，我们可以利用State的特性。

```jsx
useEffect(() => {
    const id = setInterval(() => {
        setCount((count)=>count+1);
    }, 1000);
    return () => clearInterval(id);
}, []);
```

移除了外部依赖，访问的永远是内部的count，这样的effect就不存在问题了。



## useState

用于给函数组件添加状态，状态一旦发生改变，会触发组件的重渲染（销毁->获取最新的props->渲染）。

**注意，这里的props是重新获取的。**

useState返回数组，数组第一项为`state`， 第二项为`useState`

useState告诉React，什么数据需要React帮助我们去记录，只有这些被记录的数据发生改变的时候， 才帮助我们需重新渲染组件，组件的重渲染会引发**所有**子组件的重渲染。

**状态以及变量**

- 只有影响程序的最终输出结果的，才属于状态。
- 普通变量不会影响程序最终输出结果，称为普通变量。
- 状态应该最小化。

**大量数据**

我们常常有这么一个业务场景，这个场景也是让我非常头疼的一个现象。

- 请求一个完整的数据对象，以表单形式呈现数据对象的全部字段，对数据对象进行修改并且提交。

我们用`useState是这样的`

```jsx
useEffect(()=>{
  API.getData().then(res=>{
      setdata(res)
  }) 
},[])

const [data, setdata] = useState({});

// data
//{
//    name:'ahreal',
//    age:19,
//    skill:[
//      {
//        name:'HTML',
//        level:1
//      },
//      {
//        name:'CSS',
//        level:2
//      }
//    ]
// }
```

实际上，这并不符合`useState`设计原则，数据结构过于复杂了，且如果直接使用`setSatet`更新，需要每次对数据进行深拷贝，但实际上，业务场景的数据结构会更加复杂。

对此有几种解决方案：

1. 对数据进行拆解，拆分称多个state
2. 使用`useReducer`

先来看拆分`state`

```jsx
useEffect(()=>{
  API.getData().then(res=>{
      setname(res.name)
      setage(res.age)
      setskill(res.skill)
  }) 
},[])

const [name, setname] = useState('');
const [age, setage] = useState(-1);
const [skill, setskill] = useState([]);
```

这么做虽然让我们更新state方便了许多，但也导致我们代码十分冗余，且提交的时候又需要手动收集一份数据，简直就是一坨💩。

那么如果使用`useReducer呢`，一样不是最佳解决方案

- 依旧无法绕开深拷贝这件事。
- 有点大材小用，很多时候我们仅仅是为了深度更新某个值，且这些逻辑并不会复用于其他组件。

```jsx
function ReducerTest() {
  const action = (state,action) => {
    const _state = JSON.parse(JSON.stringify(state))
    switch (action.type) {
      case 'name':
        _state.name = 'tom'
        break;
      default:
        _state.age = 0
        break;
    }
    return _state
  }
  const [data,dispatch] = useReducer(action,{
    name: 'ahreal',
    age: 19
  });
  return (
    <div>
      <p>{data.name}</p>
      <p>{data.age}</p>
      <button onClick={()=>dispatch({type:'name'})}>点我修改名字</button>
      <button onClick={()=>dispatch({type:'age'})}>点我修改年龄</button>
    </div>
  )
}
```



**immer.js**

这是一个我未曾实践过的库，但是看说明貌似能够给我们带来极大的好处：

[2020要用immer来代替immutable优化你的React项目](https://juejin.im/post/5e0968ed51882549766f3b9b)

- 防止组件在调用`setState`设置与原来相同值的情况下进行更新
- 更易用的`setState`

光是一点易用的setState，其实已经光芒四射了，因为很长一段时间内我没找到`state`数据更新的优秀解决方案。

一个简易的DEMO

```jsx
import produce from 'immer';

const array = [{value: 0}, {value: 1}, {value: 2}];
const arr = produce(array, draft => {
  draft[0].value = 10;
});

console.log(arr === array);
```

我们可以使用`useImmer来代替useState`

```jsx
useEffect(()=>{
  API.getData().then(res=>{
      setdata(res)
  }) 
},[])

const [data, setdata] = useImmer({});

setdata(state=>{
    state.name = 'ahreal'
})
```

非常容易的进行state深度更新，并且旧的数据会重用，不会刷新所有子组件（需要配合`React.memo`）。



## useContext

提供给函数组件访问Context的能力。

**Demo**

```jsx
const MyContext = React.createContext({})

function APP(props) {
  const [ data, setData ] = useState('ahreal')
  return (
    <div>
      <MyContext.Provider value={{ data, setData }}>
        <Children/>
      </MyContext.Provider>
    </div>
  )
}

function Children(){
  const { data, setData } = useContext(MyContext)
  
  return (
    <div>
      我接收到的context是{data}
      <input value={data} onChange={(e)=>setData(e.target.value)}></input>
    </div>
  )
}
```

- useContext接收Context对象，返回Context的内容。
- 可以直接引入其他文件创建的Context对象，而不用担心Context对象不同，因为模块变量具有**单例**特性。





## useCallback

我们都知道，React的函数组件再每次渲染的时候，都会执行一遍一整个函数数组，来获取返回的渲染后的`VDom`，如果我们在函数内部声明了一个函数，那么该函数在每次重渲染的时候都会重新声明。

```jsx
function MyComponent(){
    const getData = () => {
        ...
    }
    return (
    	<div>Component</div>
    )
}
```

可以观察到，每次渲染的时候`getData`函数都会重新声明。

**Demo**

```jsx
function MyComponent(){
  const [count, setCount] = useState(0);
  const [toggle, setToggle] = useState(false);

  const CallBack = useCallback(()=>{
    console.log(count)
  }, [toggle])

  return (
    <div>
      <p>{count}</p>
      <button onClick={()=>setCount(count+1)}>点我count+1</button>
      <button onClick={()=>setToggle(!toggle)}>点我重新生成callBack</button>
      <button onClick={CallBack}>点我调用Func</button>
    </div>
  )
}
```

- 当`count`改变的时候，`CallBack`始终打印的是0
- 当第一次点击重新生成`CallBack`时候，打印的结果就是最新的count值



**讲到这，不得不提一下React一个神级高阶组件API，React.memo**

在使用React过程中，发现React有个让我十分恶心的设计。

就是父组件一旦刷新，那么子组件全部都重新渲染。

假设我有一个组件FatherA，以及两个子组件ChildrenA与ChildrenB

```jsx
function FatherA(){
  const [name, setName] = useState('ahreal');
  const [age, setAge] = useState(18);

  return (
    <>
      <button onClick={()=>setName('allen')}>修改name</button>
      <button onClick={()=>setAge(20)}>修改age</button>
      <ChildrenA name={name}></ChildrenA>
      <ChildrenB age={age}></ChildrenB>
    </>
  )
}

function ChildrenA({name}){
  useEffect(()=>{
    console.log('子组件A挂载了')
    return ()=>{
      console.log('子组件A卸载了')
    }
  })
  return (
    <div>
      我的名字是{name}
    </div>
  )
}

function ChildrenB({age}){
  useEffect(()=>{
    console.log('子组件B挂载了')
    return ()=>{
      console.log('子组件B卸载了')
    }
  })
  return (
    <div>
      我的年龄是{age}
    </div>
  )
}
```

很容易发现，假设`FatherA` 只是修改了`name`，没有修改`age`，依赖`name`的`ChildrenA`刷新了能接受，依赖了`age`没有依赖`name`的`ChildrenB`也一起刷新了，这就不能忍了😡

我们可以使用`React.memo`稍加改造`ChildrenA`与`ChildrenB`。

```jsx
const ChildrenA = React.memo(({name}) => {
  useEffect(()=>{
    console.log('子组件A挂载了')
    return ()=>{
      console.log('子组件A卸载了')
    }
  })
  return (
    <div>
      我的名字是{name}
    </div>
  )
},(prev, next)=>{
  if(prev.name === next.name){
    return true
  }
  return false
})

const ChildrenB = React.memo(({age})=>{
  useEffect(()=>{
    console.log('子组件B挂载了')
    return ()=>{
      console.log('子组件B卸载了')
    }
  })
  return (
    <div>
      我的年龄是{age}
    </div>
  )
},(prev,next)=>{
  if(prev.age === next.age){
    return true
  }
  return false
})
```

以上是`memo`这个API的标准写法，其实例子中memo的第二个参数可以省略（只需要**浅层对比**）:

```jsx
const ChildrenA = React.memo(({name}) => {
  useEffect(()=>{
    console.log('子组件A挂载了')
    return ()=>{
      console.log('子组件A卸载了')
    }
  })
  return (
    <div>
      我的名字是{name}
    </div>
  )
})

const ChildrenB = React.memo(({age})=>{
  useEffect(()=>{
    console.log('子组件B挂载了')
    return ()=>{
      console.log('子组件B卸载了')
    }
  })
  return (
    <div>
      我的年龄是{age}
    </div>
  )
})
```

可以实现同样的效果。

难过的东西都没有了🎉



## useMemo

`useMemo`用于保存**复杂**计算的结果。

`useMemo`与`useCallback`使用场景特别相似，都是用于性能优化，不同的是`useMemo`返回的是一个值，而`useCallback`返回的是一个函数。

假设我们有`MyComponent`以及`Counter`两个组件，以及一个复杂计算函数`Fibonacci`

```jsx
function MyComponent(){
  const [step, setStep] = useState(3);

  const [data, setData] = useState(1);

  return (
    <div>
      <button onClick={()=>setStep(step+3)}>step加3</button>
      <button onClick={()=>setData(data+1)}>data加1</button>
      <Counter step={step} data={data}/>
    </div>
  )
}

function Counter({step,data}){
  // 使用useMemo保存计算结果
  // const result = useMemo(() => Fibonacci(step), [step])
  
  // 不使用useMemo保存计算结果
  const result = Fibonacci(step)
  
  return (
    <div>
      <p>{data}</p>
      <p>{result}</p>
    </div>
  )
}

function Fibonacci(step){
  if(step==1){
      return 1
  }
  if(step==2){
      return 1
  }
  return Fibonacci(step-1) + Fibonacci(step-2)
}
```

程序运行情况分两种情况：

- 不使用`useMemo`保存计算结果
  - 在`step`值加到40以上的时候，明显感受到`result`变量计算缓慢
  - 只修改`data`状态，`Couter`组件重新渲染，已经发生卡顿，原因在于`Couter`重新计算了`result`变量，但其实在不改变`step`的情况下，`result`不应该重新计算。
- 使用`useMemo`保存计算结果
  - 在`step`值加到40以上的时候，明显感受到`result`变量计算缓慢
  - 只修改`data`状态，组件渲染依旧流畅，原因是`result`依赖项没有发生改变，`result`没有重新计算。



## useRef

`useRef`其实就是函数组件的实例属性，在**函数组件的生命周期内（或者说实例没有被销毁）**始终存在且保持不变。

**useRef修改时候，并不会引起组件的刷新重渲染** 

**Ref也可用作DOM节点的引用**

**DEMO1**

```jsx
function MyComponent(){
  const count = useRef(0)
  return (
    <div>
      <button onClick={()=>{count.current = count.current +1} }>count加1</button>
      <p>当前的count {count.current} </p>
    </div>
  )
}
```

可以看到，我们修改`count`的时候，`p`标签始终显示为0

**DEMO2**

```jsx
function MyComponent(){
  const [count, setCount] = useState(0);
  const prev = useRef(0)

  useEffect(() => {
    prev.current = count
  });

  return (
    <div>
      <button onClick={()=>setCount(count+1)}>count加1</button>
      <p>当前的count {count} </p>
      <p>之前的count {prev.current} </p>
    </div>
  )
}
```

程序执行可发现，即使我们`prev.current = count`去修改`ref`值，但组件并没有重新渲染。

**详细执行过程**

1. 组件实例化，组件挂载。此时组件显示`count = 0` , `prev = 0`
2. 点击button，修改`count`，触发组件重新渲染
3. 组件重新渲染，此时组件显示`count = 1`, `prev = 0`
4. 组件重新渲染完成，执行`effect`，`ref` 被赋值成 1
5. 此时组件并没有重新渲染，程序按照我们预期的执行。



**访问DOM**

```jsx
function Component(){
  const $Buttom = useRef(null)

  return (
    <div>
      <button ref={$Buttom}>button</button>
      <button onClick={()=>console.log($Buttom.current)}>print</button>
    </div>
  )
}
```



**如果需要访问子组件中的dom呢?使用React.forwardRef**

`React.forwardRef` 是React中一个高阶组件，高阶组件内部会帮组件注入接收到`ref`， 且作为函数组件的第二个参数使用。

```jsx
function Component(){
  const $Buttom = useRef(null)

  return (
    <div>
      <button ref={$Buttom}>button</button>
      <button onClick={()=>console.log($Buttom.current)}>print</button>
    </div>
  )
}
```



**使用React.createRef有什么区别**

- 效果上没有区别
- 性能上，`createRef` 在函数每次重新渲染的时候都会重新创建一个`ref`对象，而`useRef`不会。



## useImperativeHandle

有这么一种场景，我们需要访问子组件某些属性或者函数，我们可以将父组件的`ref`传递给子组件，子组件通过修改父组件`ref.current`来暴露属性或者函数。

可以不使用`useImperativeHandle`

```jsx
const Component = () => {
  const childrenRef = useRef({})

  return (
    <div>
      <button onClick={() => childrenRef.current.say()}>调用children方法</button>
      <Children ref={childrenRef} />
    </div>
  )
}

const Children = React.forwardRef((props, ref) => {
  const say = useCallback(() => {
    console.log('i am a children')
  }, []);

  useEffect(() => {
    ref.current = {
      say
    }
  }, [])

  return (
    <div>
      i am a children
    </div>
  )
})
```

使用`useImperativeHandle`

```jsx
const Component = () => {
  const childrenRef = useRef({})

  return (
    <div>
      <button onClick={() => childrenRef.current.say()}>调用children方法</button>
      <Children ref={childrenRef} />
    </div>
  )
}

const Children = React.forwardRef((props, ref) => {
  const say = useCallback(() => {
    console.log('i am a children')
  }, []);

  useImperativeHandle(ref,()=>{
    return {
      say
    }
  }, [])
  

  return (
    <div>
      i am a children
    </div>
  )
})
```

代码貌似看起来就更清晰了，非常直观可知在向`ref`暴露数据。



## useLayoutEffect

与`useEffect`十分相似，区别在于执行的时机。

`useLayoutEffect`与类组件中的`componentDidMount`，`componentDidUpdate` 是完全一致的。

`useEffect`触发时机是晚于`componentDidMount`,`componentDidUpdate `，这样带来的好处是不会因为一些大量的`js`代码计算导致的视图阻塞。



## 禁止滥用memoized

在开发中，禁止滥用`useMemo`以及`useCallback`。

具体参考[【译】什么时候使用 useMemo 和 useCallback](https://jancat.github.io/post/2019/translation-usememo-and-usecallback/)