---
title: TypeScript笔记
date: 2020-05-08 13:01:09
updated: 2020-05-14 12:04:34 
tags: TypeScript
categories: 前端工程化
keywords:
description:
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/ts.jpeg
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/ts.jpeg
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

TS的介绍，安装，基本使用。

## 简介
![image.png](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/1589972559067_0.2087.png)

[官网传送门](https://www.typescriptlang.org/)

由微软开发的一个开源JavaScript的超集，主要提供了类型系统和对ES6的支持，他可以编译成纯JavaScript，任何现有的JavaScript都是合法的TypeScript的程序。

> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open source.

ts编写的文件采用ts作为文件后缀。

## 与Flow区别

本质区别上Flow是一种JavaScript的静态类型检查工具， 和TypeScript是一种语言。



## 优势以及缺点

 **TypeScript 增加了代码的可读性和可维护性**

- 类型系统实际上是最好的文档，大部分的函数看看类型的定义就可以知道如何使用了
- 可以在编译阶段就发现大部分错误，这总比在运行时候出错好
- 增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等

**TypeScript 非常包容**

- TypeScript 是 JavaScript 的超集，`.js` 文件可以直接重命名为 `.ts` 即可
- 即使不显式的定义类型，也能够自动做出[类型推论]()
- 可以定义从简单到复杂的几乎一切类型
- 即使 TypeScript 编译报错，也可以生成 JavaScript 文件
- 兼容第三方库，即使第三方库不是用 TypeScript 写的，也可以编写单独的类型文件供 TypeScript 读取

**TypeScript 拥有活跃的社区**

- 大部分第三方库都有提供给 TypeScript 的类型定义文件
- Google 开发的 Angular2 就是使用 TypeScript 编写的
- TypeScript 拥抱了 ES6 规范，也支持部分 ESNext 草案的规范

**TypeScript 的缺点**

任何事物都是有两面性的，我认为 TypeScript 的弊端在于：

- 有一定的学习成本，需要理解接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型（Enums）等前端工程师可能不是很熟悉的概念
- 短期可能会增加一些开发成本，毕竟要多写一些类型的定义，不过对于一个需要长期维护的项目，TypeScript 能够减少其维护成本
- 集成到构建流程需要一些工作量
- 可能和一些库结合的不是很完美

大家可以根据自己团队和项目的情况判断是否需要使用 TypeScript。



## 安装

**TypeScript** 提供一个cli工具， 让我们可以直接在命令行使用他。

**NPM安装**

```bash
npm install -g typescript
```

安装完成以后， 我们会得到一个全局命令 `tsc`

我们可以很轻易的去使用它。

```shell
tsc hello.ts
```

如果你的代码没有出现任何问题，你将会得到一个**hello.js**， 这是通过ts编译器转换而成的js文件， 可直接运行。



## 配置文件

通过cli工具，快速创建配置文件

```shell
tsc --init
```

这时你会得到一个 **tsconfig.json** 的配置文件



### 常用配置项

**target**

将ts代码转换成哪个es规范的代码，默认是`es5`

**module**

将ts代码转换成js代码之后，使用的模块化标准，默认是`commonjs`

**outDir**

将ts代码转换成js代码后的输出路径，默认是`./`,  我们习惯`./dist`

**rootDir**

将哪个目录中的ts代码进行转换，默认是`./` ，我们习惯 `./src`

**strict**

是否转换成采用严格模式的js代码

### 使用配置文件

```shell
tsc -p ./tsconfig.json
```

指定ts配置文件



## 类型声明

我们可以通过：冒号对变量进行类型声明

```typescript
let name:string = 'ahreal' 
```

当我们去试图修改name这个变量的时候，修改成其他类型的时候是不被允许的

类型声明还有非常多的类型比如：

```typescript
let isActive:boolean = false
```

```typescript
let age:number = 18
```

```typescript
let no:undefined = undefined
```



### 数组Array

可以利用  **<>**  泛型去定义一个数组，描述数组的元素的类型组成

```typescript
let girlFriend : Array<string> = ['bb','cc','dd']
```

或者直接在元素类型在前，[]在后的形式去声明数组

```typescript
let girlFriend : string[] = ['bb','cc','dd']
```



### 元组Tuple

对于已经了解数组的元素类型和元素个数的情况，我们直接可以使用**元组Tuple**去定义这个数组

比如说我这边需要一个数组，去存我三个朋友的名字，那么我可以利用**元组的写法**去声明类型

```typescript
let friends : [string,string,string] = ['bb','vv','dd']
```

或者说这边使用一个数组去装我其中一个女朋友的信息，名字和年龄还有身高

```typescript
let friends : [string,number,number] = ['bb',18,168]
```



### 空值void

 与Flow一致，只能赋值为`undefined`

**注意：早期的TS版本void类型可以赋值为null，在最新版本void只能赋值为undefined**



### undefined，null

只能赋值`undefined`或者null类型



### never

一般用于定义一个函数永远不可以出现终点，即这个函数不可能执行完毕，常见的要么报错，要么死循环。

```typescript
const err = ():never => {
    throw new Error('error')
}
```

这里要区分与无返回值函数的区别。

```typescript
// 这代码其实是可行的，void不代表函数不可以有return关键字， 只是限制了return必须返回void类型
const fn = ():void => {
	return undefined
}

// never表示函数一旦执行了， 无法跳出这个函数。
const deelLoop = ():never => {
  while(true){}
}
```



### 任意类型any

任意类型都可以，即为不对其进行类型检查。

**如果声明变量的时候没有对变量类型进行声明 并且没有赋值 ，那么将会默认声明成any类型的变量。**

```typescript
let variable; 
//等价于
let variable:any = undefined;
```

可以认为，**声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值**。



### 类型推断

声明变量的时候如果没有声明类型，那么会自动根据赋值的类型进行类型推断

```typescript
let name = 'ahreal'
//等价于
let name:string = 'ahreal'
```



### object表示非原始类型

**object**表示非原始类型，也就是除`number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型。

这里要注意，null在ts中不属于object类型，即使在js中`typeof null == 'object'`

```typescript
const obj:object = null;
// error

typeof null == 'object'
// true
```



### 枚举enum

typescript提供一种JavaScript中不存在的枚举类型，可以方便显性地为某一类数据的可能性做出命名声明。使其代码约束性更强， 可读性也更强。

```typescript
enum myname {
    oldName='ahreal',
    newName='allen'
}

console.log('我的新名字是:' + myname.newName)
//'我的新名字是：allen'

const sayName = (name:myname):void=>{
  console.log('我的名字是:'+ name)
}

sayName(myname.newName)
// '我的名字是:allen'
```

**枚举自增**

- 枚举的内容可以不为其赋值， 当所有内容都没有赋值的时候，所有枚举内容都为0
- 当为其中一个值赋于数字值，该枚举类型之后的值递增，之前的值从0递增
- 不可只为其中一个值赋予除数字类型以外的值，除非该值为枚举类型的最后一个



## 高级特性

### 联合类型

表示可以取值为多种类型中的一种。类似**Flow的或**

```typescript
let variable:string|number = 'ahreal'
```



### 交叉类型

表示为两个类型的合并类型，使用 **&** 连接

```typescript
interface interfaceA  {
  name:string,
  age:number
}

interface interfaceB {
  sayHi:()=>void
}

let person: interfaceA & interfaceB  = {
  name:'ahreal',
  age:18,
  sayHi:()=>{}
}

let name: string & number = 'ahreal'
// error , 基本类型合并以后会得到never类型, 字符串无法赋值给never类型
```



### 类型保护

TS能够在代码编译阶段进行错误检查，但有一些情况必须只有在代码运行时候才知道是否是可靠的。

我们可以创建一个函数，这个函数返回值为boolean类型，可以声明函数的执行结果为类型声明。

```typescript
const arr: [string,number] = [
  'ahreal',
  18
]

const randomSelect = () => {
  let randomNum = Math.random() * 100
  
  if(randomNum>50) return arr[0]
  
  return arr[1]
}

let result = randomSelect()

// 类型保护函数
const isString = (value): value is string =>{
  if(value.length){
    return true
  }else{
    return false
  }
}

if(isString(result)){
  console.log(result.length)
}else{
  console.log(result.toFixed(2))
}
```

**当然，js内置的 typeof 方法也可解决这个方法，类型保护函数更适用于适用于复杂的类型判断**

**且typeof 类型保护在 TS中仅使用于 string/number/boolean/symbol**



### 字面量类型

字面量类型分为数字字面量以及字符串字面量类型。

```typescript
const name:'ahreal'|'allen' = 'tom'
// error
const name:'ahreal'|'allen' = 'ahreal'
const name:'ahreal'|'allen' = 'allen'
// success

const age:19 = 19
// success
```



### keyof

可将一个接口类型的所有属性名提取成一个字面量联合类型

```typescript
interface Person {
  name:string,
  age:number
}

type Props = keyof Person
// "name" | "age"

let Props:Props = 'age'
// success
let Props:Props = 'name'
// success
let Props:Props = 'sex'
// error
```

有了keyof以后，我们可以判断动态属性名类型。

假设我有一个函数，函数接收两个参数

- 对象
- 属性名

函数返回对象属性名的值

```typescript
const func1 = (obj:object, key:string) => {
  return obj[key]
}

const person = {
    name:'ahreal',
    age:19
}

func1(person,'sex')
// 得到undefined，显然这些是可以在编译阶段检查出来的
```

我们可以很容易的限制参数`obj`为一个对象，`key`为一个字符串，但是我们如果不使用`keyof`，便很难限制，`key`必须为obj的一个属性名。

使用`keyof`以后。

```typescript
const func1 = <T extneds {[prop:string]:any}>(obj:T, key:keyof T) => {
  return obj[key]
}

const person = {
  name:'ahreal',
  age:19
}

func1(person,'sex')
// error
```



### 索引访问操作符[]

我们如何才能访问接口中某个属性的类型呢，使用`[]`即可

```typescript
interface MyInterface {
	name:string
	age:number
}

type MyStringType = MyInterface['name']
```



### 映射类型

TypeScript内置了几种映射类型，映射类型可以简单的认为是对接口的属性进行遍历操作。

- Readonly 只读
- Partial 可选
- Pick 选出接口中指定属性的类型
- Record 用于描述接口属性类型以及属性值类型，返回一个新的接口

假设我们有一个接口，我们需要为接口所有属性添加readonly描述。

我们可以手动添加readonly关键字

```typescript
interface MyInterface {
	readonly name:string
	readonly age:number
}
```

也可以使用**Readonly**映射类型

```typescript
interface MyInterface {
	name:string
	age:number
}

type readonlyMyInterFace = Readonly<MyInterface>
```

同理，需要将所有属性转换为可选属性，使用**Partial**。

```typescript
interface MyInterface {
	name:string
	age:number
}

type PartialMyInterFace = Partial<MyInterface>
```

假设，我们需要一个类型是某个接口精简过的，我们可使用**Pick**

```typescript
interface MyInterface {
	name:string
	age:number
	address:string
}

type PickInterFace = Pick<MyInterface, 'name'|'age'>
// {
//   name:string
//   age:number
// }
```

假设我们需要定义一组animals数据，用一个对象承载，对象属性名为动物的种类，对象属性值为动物的名字和属性。

```typescript
const animals = {
  dog:{
    name:'jack',
    age:18
  },
  cat:{
    name:'tom',
    age:20
  },
  mouse:{
    name:'jerry',
    age:15
  }
}
```

我们可以用**Record**快速的定义类型。

```typescript
interface Animal {
  name:string,
  age:number
}

type Animals = Record<'dog'|'cat'|'mouse', Animal>

const animals:Animals = {
  dog:{
    name:'jack',
    age:18
  },
  cat:{
    name:'tom',
    age:20
  },
  mouse:{
    name:'jerry',
    age:15
  }
}
```



### 增加或删除属性修饰符

可在类型修饰符前面使用`+`或者`-`号

```typescript
interface Person {
  name:string,
  age:number
}

type readOnly<T> = {
  +readonly [ p in keyof T ] : T[p]
}

type unReadOnly<T> = {
  -readonly [ p in keyof T ] : T[p]
}
```



### unknown

- 任何类型的值都可赋值给unknown
- 如果没有类型断言，unknown不可赋值给其他类型（除了any和unknown）
- 与其他类型组合的交叉类型，都等于其他类型
- 与其他类型组合（除了any）的联合类型，都为unknown
- never是unknown的子类型



### infer

表示等待推断的类型

```typescript
type inferType<T> = T extends Array<infer U> ? U : never 

type type1 = inferType<string>
// never
type type2 = inferType<string[]>
// string
type type3 = unType<[string,number]>
// string | number
```



### Exclude

接收两个类型参数，返回类型参数一中**不兼容**类型参数二的类型

```typescript
type type = Exclude<number|string|boolean, string|number>
// boolean
```



### Extract

接收两个类型参数，返回类型参数一中**兼容**类型参数二的类型

```typescript
type type = Extract<number|string|boolean, string|number>
// number | string
```



### NonNullable

找出参数类型中所有不为`undefined`, `null`, `never`类型。

```typescript
type type = NonNullable<number|string>
// number|string
type type = NonNullable<string|never>
// string
type type = NonNullable<number|string|undefined>
// number|string
```



### ReturnType

返回函数类型的返回值类型

```typescript
type fnType = ()=>string

type returnType = ReturnType<fnType>
// string
```





## 类型断言

通常发生在你明白一个类型有比它现有类型更加确切的类型，这时候可以使用类型断言。

有两种写法：

**尖括号**

```typescript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

**as**

```typescript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

注意， 在**jsx**中，只可以使用as对类型进行断言



## TS中的类

与ES6的类大抵相似，稍微有些不同。

假设我们在ES6声明一个`person`类。

**ES6**

```javascript
class Person {
  constructor(name,age){
    this.name = name
    this.age = age
  }

  sayName(){
    console.log(this.name)
  }
}
```

**TypeScript**

```typescript
class Person {
  name:string
  age:number
  constructor(name:string,age:number){
    this.name = name
    this.age = age
  }

  sayName():void{
    console.log(this.name)
  }
}
```

TS与ES6不同的是：

- 使用到的类属性，需要事先定义。
- 类属性必须在**constructor**中赋值， 否则得事先声明默认值



### 访问修饰符

可以在类成员前通过添加关键字来设置当前类成员的访问权限

修饰符有三种：

- public  公开的，默认
- privcate  私有的，只能在当前类中访问
- protected 受保护的，只能在当前类中或者子类中访问



**public**

```typescript
// 默认即为public， 加与不加效果一致
class Person {
  public name:string
  age:number
  constructor(name:string,age:number){
    this.name = name
    this.age = age
  }

  sayName():void{
    console.log(this.name)
  }
}

const person = new Person('allen', 18)

console.log(person.name)
// allen
console.log(person.age)
// 18
```



**private**

```typescript
// private能且只能在当前类中访问
class Person {
  private name:string
  private age:number
  constructor(name:string,age:number){
    this.name = name
    this.age = age
    this.sayName()
  }

  sayName():void{
    console.log(this.name)
   // private可以在当前类中访问
  }
}

const person = new Person('allen', 18)

console.log(person.name)
// error
```



**protected** 

```typescript
// protected能在当前类或者子类中进行访问
class Person {
  private name:string
  private age:number
  constructor(name:string,age:number){
    this.name = name
    this.age = age
  }

  protected sayName():void{
    console.log(this.name)
  }
}

class Son extends Person {
  sayFatherName(){
    super.sayName()
    // protected 的成员属性可在子类中访问
  }
}
```



### 参数属性

前面的例子， 我们在使用类的属性的时候，必须事先在类里面声明。

```typescript
class Person {
  name:string
  constructor(name:string){
    this.name = name
  }
}
```

TS提供了一种能让我们更加快速定义类的方式， 即 **参数属性**

```typescript
// 只需要在构造函数参数前面加上访问修饰符， 即可视为声明了相应类的属性
class Person {
  constructor(public name:string){
    this.name = name
  }
}
```



### 类的只读属性

我们可以声明某个类属性为只读属性，使用**readonly**关键字，只读具有只可访问，不可修改的特点。

```typescript
enum Sex {
  male = 0,
  female = 1,
}

class Person {
  constructor(public name:string, public readonly sex:Sex){
    this.name = name
    this.sex = sex
  }
}

let person = new Person('allen', Sex.male)

person.name = 'ahreal'

person.sex = Sex.female
// error sex is a read-only property
```



### 类属性存取器

我们可以显性的为类的属性添加get和set方法，当用户访问实例属性的时候，会调用get方法，当用户设置实例属性的时候，会调用set方法。

假设我们有一个场景，我们需要在设置属性之前检查一下属性的合法性。

```typescript
class Person {
  private _name:string = 'default'

  constructor(name:string){
    this.name = name
  }

  get name():string{
    return this._name
  }

  set name(name:string){
    if(!this.validate(name)) {
      throw new Error('名字长度不合法')
    }
    this._name = name
  }
 
  // 我们检查了参数的合法性
  private validate(name:string){
    if(name.length > 5) {
      return false
    }
    return true
  }
}

let person = new Person('allen')

person.name = 'allenahreal'
// error

console.log(person._name)
// error
```



当某一个类属性具有存取器时， 这个类属性的访问修饰符最好设置为private，不允许外部直接访问属性。而是必须通过get和set进行访问



## 接口

**interface**，是对格式的一种规范，接口不会去检查属性的顺序，**只会检查属性是否存在以及属性的类型**

**接口也是一种类型**



### 第一个例子

```typescript
interface boy{
  name:string,
  money:number,
  success:(data:Object)=>void
}

function change(option:boy):void{

}

change({
  name:'allen',
  money:100,
  success:(data)=>{}
})
```

我们定义了一个change函数，change函数的接收的参数option必须是boy接口类型。



### 可选属性

**?表示可选属性**

```typescript
interface boy {
	name:string;	//一个boy，可以没钱，但是必须要有自己的名字
	money?:number
}
```

**？如果我们把参数名字拼错，TS还会帮我们检查其参数名错误**



### 接口的只读属性

readonly 只读属性，只可以在声明的时候赋值

```typescript
interface boy {
	readonly sex:string;	//一个boy，一出生就定好性别，不可以改变
}
```



**数组也可以作为一个只读的数组，ReadonlyArray\<T>**

```typescript
let a:number[] = [1,2,3,4,5]

let ro:ReadonlyArray<number> = a	//这样a数组就不可以被修改了
```



**接口同时也可帮助我们限制对象某些属性为只读属性**

```typescript
interface boy {
	readonly sex:string;	//一个boy，一出生就定好性别，不可以改变
}

const b:boy = { sex:'男' }

b.sex = '女'
// error
```



### 可索引的类型

对索引类型得到值的类型进行定义

**值得注意的是，设置number索引的时候，ts会将其转换成对应的字符串形式进行索引。**

**所以，你 数字 1 索引的结果应当和字符串 ‘1’ 索引的结果一致 **

```typescript
interface Boy {
  [props:string]:string,
}
// 我们声明string类型的索引，得到的属性值一定是string

let b:Boy = {
  name:'allen',
  age:19
}
// error
// 因为我们规定string类型的索引返回值一定是string类型，我们如上定义的b['age']的值确为number
```



我们常用**可索引的类型**这个特性，来帮助我们规定除接口**定义以外的属性的类型**。

比如说我们现在有个接口`Boy`，规范了`b`这个对象的类型

```typescript
interface Boy {
  name:string,
  age:number
}

let b:Boy = {
  name:'allen',
  age:18
}
```

现在我们需要在b身上添加属性

```typescript
b.hobby = 'game'
// error， 因为Boy这个接口未定义hobby
```

但其实我们并不希望这个`Boy`接口去约束`hobby`，`Boy`只约束他事先声明的属性，我们可以

```typescript
interface Boy {
  name:string,
  age:number,
  [props:string]:any
}
```

规定了字符串类型的索引得到的属性类型为 **any**

这样我们就可以在boy身上任意设置除了`name`, `age`以外的属性。



### 函数类型接口

```typescript
interface myFn {
	(name:string,age:number,isBoy:boolean):void
}
    
let logInfo : myFn

logInfo = function(name:string,age:number,isBoy:boolean){
    console.log(`my name is ${name},im a ${isBoy?'boy':'gril'},i'm ${age} year's old`)
}
```



### 类类型接口

我们可以定义一个接口来规定类的属性以及类的方法。

使用 **implements** 关键性声明类所实现的接口。

```typescript
interface person {
  name:string,
  age:number,
  eat:()=>void,
  [props:string]:any
}

class Person implements person {
  name:string
  age:number
  sex:number
  constructor(name:string, age:number, sex:number){
    this.name = name
    this.age= age
    this.sex = sex
  }
  eat(){

  }
}
```



### 接口继承

接口继承接口， 子接口拥有父接口的所有特性。

```typescript
interface twoPoint {
  x:number,
  y:number
}

interface threePoint extends twoPoint {
  z:number 
}

let p:threePoint = {
  x:1,
  y:1,
  z:1
}
```

**接口可实现多继承**

```typescript
interface twoPoint {
  x:number,
  y:number
}

interface pointInfo {
  name:string
}

interface threePoint extends twoPoint, pointInfo {
  z:number 
}

let p:threePoint = {
  x:1,
  y:1,
  z:1,
  name:'点点'
}

```



**无法随意重写父接口的类型声明**



## 泛型

有时候我们使用TS能够十分好的去控制我们想要得到的结果，但是有时候我们希望我们的做的API能够拥有良好的可重用性，不仅支持我们预期的类型， 还支持一些未知的类型，这种类型我们称之为泛型。

### 类型变量

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

例子中，我们定义了我们接收的arg参数，它的类型是变量T（当然我们需要事先使用<>声明这个变量）。

有了这个变量，例子中我们做到了输入的类型和输出的类型始终保持一致。

以上的例子中的`identity`函数，我们称其为**泛型函数**

与any不同的是，any是**不可控**的。

```typescript
function identity(arg: any): any {
    return arg;
}
```

在未使用类型变量时，我们**无法确保**参数类型和返回值类型始终保持一致。



**类型变量其实是函数的第二种参数**

我们可知，函数可以接收参数，声明于括号里面**（）**

类型参数是函数的第二种参数，声明于 **<>** 里面

```typescript
function fn<T>(arg: Array<T>): void {
    console.log(arg.length)
}

fn<string>(['1','2'])
```

例子中，我们声明了一个函数`fn`，函数fn接收一个数组参数， 数组元素类型为T，而具体T是什么类型是由调用者传递。



**调用泛型函数时也可以不传递类型参数**

```typescript
function fn<T>(arg: Array<T>): void {
    console.log(arg.length)
}

fn(['1','2'])
```

例子中，我们没有传递类型参数，TS会自动帮助我们推断T我们传递的类型参数是`string`

## 声明合并

待补充



## 类型兼容性

在TypeScript中类型存在包含关系，当变量类型兼容时可以正常赋值。

具体兼容性问题可以参考 [类型的逆变与协变](https://www.cocoder.club/article/27)

### 接口兼容性

先来个错误的例子🎃

```typescript
interface infoInterFace{
  name:string
}

let obj:infoInterFace = {
    name:'ahreal',
    age:18
    // error infoInterFace不存在age属性的类型定义
}
```

修改成这样写编译竟然能通过

```typescript
interface infoInterFace{
  name:string
}

let obj:infoInterFace

let obj2 = {
    name:'ahreal',
    age:18
}

let obj3:any = 'string'

let obj4 = {
    
}

obj = obj2
// success
obj = obj3
// success
obj = obj4
// error
```

- TypeScript对变量字面量赋值时候进行了严格的类型检查
- 对变量赋值给变量时，等号右边的类型必须**大于或等于**左边的类型， 小于则会不兼容。



### 函数兼容性

**参数个数兼容性**

```typescript
let func1 = (name:string) => 0
let func2 = (name:string, age:number) => 0

func1 = func2
// success

func2 = func1
// error
```

- 函数参数个数必须小于或者等于函数类型定义的参数个数

**参数类型兼容性**

```typescript
let func1 = (age:string) => 0
let func2 = (age:number) => 0

func1 = func2 
// error

let func3 = (opt:{ age:number, name:string }) => 0
let func4 = (opt:{ age:number }) => 0

func4 = func3
// error
func3 = func4
// success
```

- 函数参数类型必须小于或者等于函数定义的参数类型。
- 函数参数具有逆变兼容，返回值具有协变兼容

## 声明文件

当我们使用第三方库的时候，我们需要引用他的声明文件，才能获得对应的代码补全，接口提示等功能。

一个 ***.d.ts** 文件为一个声明文件。



### 第三方文件声明

一些著名的库一般都已经有了对应的声明文件。

我们可以直接下载下来使用，但是更推荐的是使用 `@types` 统一管理第三方库的声明文件。

`@types` 的使用方式很简单，直接用 npm 安装对应的声明模块即可，以 jQuery 举例：

```shell
npm install @types/jquery --save-dev
```

可以在[这个页面](https://microsoft.github.io/TypeSearch/)搜索你需要的声明文件。