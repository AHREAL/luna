---
title: Vue中类组件开发
date: 2020-05-12 15:22:42
updated: 2020-05-14 19:21:23 
tags:
categories:
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/vue.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/vue.png
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

在Vue项目中接入TypeScript前缀技能。

## 前言

最近需要对一个Vue项目部署**TypeScript**，在阅读大量文档后实践流程特此记录。

常见的Vue前端项目开发通常直接使用Vue**单文件SFC**模式进行开发，这样开发的Vue项目具有诸多好处，例**作用域样式**，**IDE支持** 等等优势， 但是当接入 **TypeScript** 时候，发现支持程度上不是那么的高，且代码特别抽象，同时也在TS中对于ES6的类的写法特别清晰明了。

于是在**Vue2.x**中，暂且认为最科学的TS接入姿势是接入**类组件**形式进行开发。

## 类组件

当然类组件无法直接使用，在Vue官方同时也维护了一个关于Vue的类组件修饰器`vue-class-component`。

[文档传送门](https://class-component.vuejs.org/)

### 第一个例子

文档中使用类风格定义的计数器组件。

```javascript
<template>
  <div>
    <button v-on:click="decrement">-</button>
    {{ count }}
    <button v-on:click="increment">+</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

// Define the component in class-style
@Component
export default class Counter extends Vue {
  // Class properties will be component data
  count = 0

  // Methods will be component methods
  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}
</script>
```

简单的可以发现：

- 类组件定义需要继承Vue的构造函数（这样做的也便于TS进行类型检查）
- 类的属性为组件的 `data`
- 类的方法为组件的 `method`

### 关于安装

官方文档中已十分详尽，不过多记录。



### 前缀

使用`@Component`修饰器定义类组件

```javascript
import Vue from 'vue'
import Component from 'vue-class-component'

// HelloWorld class will be a Vue component
@Component
export default class HelloWorld extends Vue {}
```



### 数据

即为**类的属性**， 可直接定义初始值

**初始值必须赋值（或者说不可赋值为undefined），否则将无法侦听数据变化**

解决方案:

- 赋值为`null`
- 使用`data hook`

```typescript
  data() {
    return {
      // `hello` will be reactive as it is declared via `data` hook.
      hello: undefined
    }
  }
```



### 方法

直接声明为类的方法即为组件的 **method**

```javascript
<template>
  <button v-on:click="hello">Click</button>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Declared as component method
  hello() {
    console.log('Hello World!')
  }
}
</script>
```



### 计算属性

计算属性可以声明为类属性 getter/ setter：

```javascript
<template>
  <input v-model="name">
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  firstName = 'John'
  lastName = 'Doe'

  // Declared as computed property getter
  get name() {
    return this.firstName + ' ' + this.lastName
  }

  // Declared as computed property setter
  set name(value) {
    const splitted = value.split(' ')
    this.firstName = splitted[0]
    this.lastName = splitted[1] || ''
  }
}
</script>
```



### 生命周期钩子

类具有同名的生命周期方法，意味着我们定义方法时候需要避开这些生命周期的命名空间

```typescript
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Declare mounted lifecycle hook
  mounted() {
    console.log('mounted')
  }

  // Declare render function
  render() {
    return <div>Hello World!</div>
  }
}
```



### 其他配置

关于Vue组件的其他配置比如 `components`, `watch`, `filters`,`props`等，直接将他们传递给修饰器函数

```javascript
<template>
  <OtherComponent />
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import OtherComponent from './OtherComponent.vue'

@Component({
  // Specify `components` option.
  // See Vue.js docs for all available options:
  // https://vuejs.org/v2/api/#Options-Data
  components: {
    OtherComponent
  }
})
export default class HelloWorld extends Vue {}
</script>
```



### 注意事项

- 类的方法不要使用箭头函数。

- 不要轻易使用类的`constructor`

  

## Vue Property Decorator

上面说完了Vue类组件的基本，这会介绍开发中会直接只用到的 Vue类风格组件属性修饰库。

官方的类修饰器**vue-class-component** 其实不是那么清晰易懂（至少相比原来.vue文件直接的写法）。

> This library fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component), so please read its README before using this library.

它提供如下装饰器

- [`@Prop`](https://www.npmjs.com/package/vue-property-decorator#Prop)
- [`@PropSync`](https://www.npmjs.com/package/vue-property-decorator#PropSync)
- [`@Model`](https://www.npmjs.com/package/vue-property-decorator#Model)
- [`@Watch`](https://www.npmjs.com/package/vue-property-decorator#Watch)
- [`@Provide`](https://www.npmjs.com/package/vue-property-decorator#Provide)
- [`@Inject`](https://www.npmjs.com/package/vue-property-decorator#Provide)
- [`@ProvideReactive`](https://www.npmjs.com/package/vue-property-decorator#ProvideReactive)
- [`@InjectReactive`](https://www.npmjs.com/package/vue-property-decorator#ProvideReactive)
- [`@Emit`](https://www.npmjs.com/package/vue-property-decorator#Emit)
- [`@Ref`](https://www.npmjs.com/package/vue-property-decorator#Ref)
- `@Component` (由[vue-class-component](https://github.com/vuejs/vue-class-component)提供)
- `Mixins`（由[vue-class-component](https://github.com/vuejs/vue-class-component)提供)

### @Component

`@Component(options:ComponentOptions = {})`

`@Component` 装饰器可以接收一个对象作为参数，可以在对象中声明 `components ，filters，directives`等未提供装饰器的选项，也可以声明`computed，watch`等

```typescript
import { Vue, Component } from 'vue-property-decorator'

@Component({
  filters: {
    toFixed: (num: number, fix: number = 2) => {
      return num.toFixed(fix)
    }
  }
})
export default class MyComponent extends Vue {
  public list: number[] = [0, 1, 2, 3, 4]
  get evenList() {
    return this.list.filter((item: number) => item % 2 === 0)
  }
}
```



### @Prop

`@Prop(options: (PropOptions | Constructor[] | Constructor) = {})`

`@Prop`装饰器接收一个参数，这个参数可以有三种写法：

- `Constructor`，例如`String，Number，Boolean`等，指定 `prop` 的类型；
- `Constructor[]`，指定 `prop` 的可选类型；
- `PropOptions`，可以使用以下选项：`type，default，required，validator`。

```typescript
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component 
export default class MyComponent extends Vue {
  @Prop(String) public propA: string | undefined
  @Prop([String, Number]) public propB!: string | number
  @Prop({
    type: String,
    default: 'abc'
  })
  public propC!: string
}

```

注意：

- 属性的ts类型后面需要加上`undefined`类型；或者在属性名后面加上!，表示`非null` 和 `非undefined`
  的断言，否则编译器会给出错误提示；
- 指定默认值必须使用上面例子中的写法，如果直接在属性名后面赋值，会重写这个属性，并且会报错。



### @PropSync

`@PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {})`

`@PropSync`装饰器与`@prop`用法类似，二者的区别在于：

- `@PropSync` 装饰器接收两个参数：
  `propName: string` 表示父组件传递过来的属性名；
  `options: Constructor | Constructor[] | PropOptions` 与`@Prop`的第一个参数一致；
- `@PropSync` 会生成一个新的计算属性。

```typescript
import { Vue, Component, PropSync } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  @PropSync('propA', { type: String, default: 'abc' }) public syncedPropA!: string
}

```

等价于

```javascript
export default {
  props: {
    propA: {
      type: String,
      default: 'abc'
    }
  },
  computed: {
    syncedPropA: {
      get() {
        return this.propA
      },
      set(value) {
        this.$emit('update:propA', value)
      }
    }
  }
}

```

**注意：@PropSync需要配合父组件的.sync修饰符使用**



### @Model

`@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {})`

`@Model`装饰器允许我们在一个组件上自定义`v-model`，接收两个参数：

- `event: string` 事件名。
- `options: Constructor | Constructor[] | PropOptions` 与`@Prop`的第一个参数一致。

```typescript
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Model('change', { type: String, default: '123' }) public value!: string
}

```



### @Watch

`@Watch(path: string, options: WatchOptions = {})`

`@Watch` 装饰器接收两个参数：

- `path: string` 被侦听的属性名；

- `options?:`WatchOptions={} options

  可以包含两个属性 ：

  `immediate?:boolean` 侦听开始之后是否立即调用该回调函数；
  `deep?:boolean` 被侦听的对象的属性被改变时，是否调用该回调函数；

**侦听开始：发生在beforeCreate勾子之后，created勾子之前**

```typescript
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Watch('msg')
  public onMsgChanged(newValue: string, oldValue: string) {}

  @Watch('arr', { immediate: true, deep: true })
  public onArrChanged1(newValue: number[], oldValue: number[]) {}

  @Watch('arr')
  public onArrChanged2(newValue: number[], oldValue: number[]) {}
}

```



### @Emit

`@Emit(event?: string)`

- 装饰器接收一个可选参数，该参数是`$Emit`的第一个参数，充当事件名。如果没有提供这个参数，`$Emit`会将回调函数名的`camelCase`转为`kebab-case`，并将其作为事件名；
- 会将回调函数的返回值作为第二个参数，如果返回值是一个`Promise`对象，`$emit`会在`Promise`对象被标记为`resolved`之后触发；
- `@Emit`的回调函数的参数，会放在其返回值之后，一起被`$emit`当做参数使用。

```typescript
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  count = 0
  @Emit()
  public addToCount(n: number) {
    this.count += n
  }
  @Emit('reset')
  public resetCount() {
    this.count = 0
  }
  @Emit()
  public returnValue() {
    return 10
  }
  @Emit()
  public onInputChange(e) {
    return e.target.value
  }
  @Emit()
  public promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}

```

等价于

```javascript
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addToCount(n) {
      this.count += n
      this.$emit('add-to-count', n)
    },
    resetCount() {
      this.count = 0
      this.$emit('reset')
    },
    returnValue() {
      this.$emit('return-value', 10)
    },
    onInputChange(e) {
      this.$emit('on-input-change', e.target.value, e)
    },
    promise() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })
      promise.then(value => {
        this.$emit('promise', value)
      })
    }
  }
}

```



### @Ref

`@Ref(refKey?: string)`

`@Ref` 装饰器接收一个可选参数，用来指向元素或子组件的引用信息。如果没有提供这个参数，会使用装饰器后面的属性名充当参数

```typescript
import { Vue, Component, Ref } from 'vue-property-decorator'
import { Form } from 'element-ui'

@Componentexport default class MyComponent extends Vue {
  @Ref() readonly loginForm!: Form
  @Ref('changePasswordForm') readonly passwordForm!: Form

  public handleLogin() {
    this.loginForm.validate(valide => {
      if (valide) {
        // login...
      } else {
        // error tips
      }
    })
  }
}

```



### @Provide

待补充...

### @Inject 

待补充...

### @ProvideReactive

待补充...

### @InhectReactive

待补充...