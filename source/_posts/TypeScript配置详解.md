---
title: TypeScript配置详解
date: 2020-05-09 21:01:42
updated: 2020-05-23 19:44:04 
tags:
categories:
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

目前最新TypeScript v3.9.2配置文件解读。

## tsconfig.json
TypeScript的配置文件，本文会对目前最新已有的所有配置项进行解释。

## files:[path]

files可以配置一个数组列表，里面包含指定文件的相对或绝对路径，编译器在编译的时候只会编译包含在files里的文件，如果不指定，则取决于`includes`选项，如果还没有， 则默认编译所有根目录以及子目录下的文件，这里列出的路径必须指向的是具体文件，而不是文件夹，且不能使用 `*`，`?`等通配符

## include:[path]

include表示需要编译的路径列表，可以是文件，也可以是文件夹，且可使用ts提供的一些通配符如`*`，比如`“include”:["./src/**/*"]`，表示的是编译src文件夹下的所有文件以及子文件夹下的所有文件。

## exclude:[path]

与`include`相反，表示不编译（排除）的文件或者文件夹，可以使用通配符。

## extends:path

可以指定一个其他的`tsconfig.json` 配置文件的路径，来继承这个文件里的配置。

## compileOnSave:true|false

指定当我们进行文件保存的时候，是否根据当前配置文件`tsconfig.json`进行重新编译，这里需要编辑器支持。

## references: []

表示需要引用的项目

## compilerOptions:{}

ts编译选项。包含大量二级配置。

### 基础选项

**Basic Options**

#### target

"ES3"|"ES5"|"ES2015"|"ES2016"|"ES2017"|"ES2018"|"ESNEXT"

指定编译之后JS代码的语法规范，默认是`ES3`

#### module

"none"|"commonjs"|"amd"|"system"|"umd"|"es2015"|"es2020"|"ESNext"

指定编译之后js代码所使用的模块系统。

#### lib:[libName]

表示在编译中所使用的库文件，如果只要你使用了一点儿ES6的语法，那么你需要引入ES6这个库，或者也可以引入ES2015。

**其实这些就是一些声明文件**

#### allowJs:true|false

是否允许编译js文件，如果不允许，则在目标文件夹里的js文件不会被编译，也就不会输出到输出文件夹(dist)里面

#### checkJs:true|false

是否对js文件进行检查，默认是false

#### jsx

"preserve"|"react-native"|"react"

指定jsx语法所使用的环境

#### declaration:true|false

用来指定是否在编译时候生成相应的`.d.ts`文件，如果设置为true，编译每个ts文件之后会生成一个`js`文件和`.d.ts`文件，这个选项和 **allowJs**选项不可同时开启

#### declarationMap:true|false

是否为声明文件生成map文件

#### sourceMap:true|false

是否为ts文件生成map文件

#### outFile:path

输出的文件，这个选项接收一个路径，路径指向一个具体文件用于输出。

比如设置为`./main.js`， 则最后只会输出一个main.js文件（即使你有依赖其他模块，模块文件会被一起打包进这个`main.js`）

**只有在"module":"amd" 或者 "module":"system"**时，outFile选项才可以使用。

#### outDir:path

指定输出的文件夹，所有输出的结果都会放进这个文件夹

#### rootDir:path, 

指定输入的根路径。

**默认以tsconfig.json所在位置为根路径，如果编译器发现不在rootDir内，却符合编译规则的文件，编译器会提示报错，可以在include配置项，将rootDir的路径一块配置进去即可**

#### composite:true|false

是否编译构建引用来的项目

#### tsBuildInfoFile:path

生成ts构建信息的的文件输出位置

#### removeComments:true|false

是否在输出文件中删除所有注释信息

#### noEmit:true|false

不输出任何文件，这样ts编译器就只会对代码进行检查，而不会输出任何文件。

#### importHelpers:true|false

从[`tslib`](https://www.npmjs.com/package/tslib)导入辅助工具函数（比如`__extends`，`__rest`等）

#### downlevelIteration:true|false

当`target`为`ES5`或`ES3`时，为“for-of”、“spread”和“destructuring”中的迭代提供完全支持

#### isolatedModules:true|false

视为每个编译文件都是互相隔离的模块。

### 严格检查选项 

**Strict Type-Checking Options**

#### strict:true|false

是否开启所有严格检查的选项。

#### noImplicitAny:true|false

一旦被类型推断成any的情况会报错。即当我们没有为一个值声明类型，类型会被推断成any类型，会报错。

#### strictNullChecks:true|false

是否使用严格的空值检查，当这个值为true的时候，`undefined`和`null`不可以赋值给除`undefined`和`null`以外的其他类型，其他类型也不可赋值给它们，除了any类型。

这里有个例外就是`undefined`可以赋值给`void`类型

#### strictFunctionTypes:true|false

是否使用函数参数`双向协变`检查。

#### strictBindCallApply:true|false

是否对函数的`bind`,`call`,`apply`的参数进行严格检测

#### strictPropertyInitialization:true|false

设置为true，则对非`undefined`类型的类属性进行初始化检查，如何开启这个，需要同时开启**strictNullChecks**

#### noImplicitThis：true|false

设置为true 时候， `this`的类型为`any`时候会报错。

#### alwaysStrict:true|false

是否使用以严格模式进行解析并且在生成的每个js文件顶部添加`"use strict"`关键字。

### 额外的检查

**Additional Checks**

#### noUnusedLocals:true|false

检查是否有声明但未使用的变量

#### noUnusedParameters:true|false

检查是否有函数存在形参未使用

#### noImplicitReturns:true|false

检查每个函数是否都有返回值

#### noFallthroughCasesInSwitch:true|false

检查`switch case`语句里，是否每个`case`后面都有跟上`break`来跳出switch

### 模块配置

#### moduleResolution:mode

两种模块查找模式，`node`以及`classic`

**classic**

这曾经是 TypeScript 的默认分辨率策略。目前，这种策略主要是为了向后兼容。

相对导入将相对于导入文件解析。所以`import { b } from "./moduleB"`在源文件中`/root/src/folder/A.ts`会导致以下查找：

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`

但是，对于非相对模块导入，编译器逐步从包含导入文件的目录开始，尝试查找匹配的定义文件。

例如：

非相对向进口`moduleB`，如`import { b } from "moduleB"`，在源文件中`/root/src/folder/A.ts`，将导致在试图用于定位在以下位置`"moduleB"`：

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`

**node**

此解析策略试图在运行时模仿 [Node.js ](https://nodejs.org/)模块解析机制。Node.js 模块文档中概述了完整的 Node.js 解析算法。

**Node.js 如何解析模块**

为了理解 TS 编译器将遵循的步骤，了解 Node.js 模块很重要。传统上，通过调用名为的函数来执行 Node.js 中的导入`require`。Node.js 所采取的行为将根据是否`require`给定相对路径或非相对路径而有所不同。

相对路径相当简单。作为一个例子，让我们考虑位于的文件`/root/src/moduleA.js`，其中包含导入`var x = require("./moduleB");`Node.js 按以下顺序解决导入问题：

1. 作为文件命名`/root/src/moduleB.js`，如果存在。
2. 作为文件夹，`/root/src/moduleB`如果它包含名为`package.json`指定一个`"main"`模块的文件。在我们的例子中，如果 Node.js 找到了`/root/src/moduleB/package.json`包含的文件`{ "main": "lib/mainModule.js" }`，那么 Node.js 会引用它`/root/src/moduleB/lib/mainModule.js`。
3. 作为文件夹，`/root/src/moduleB`如果它包含名为的文件`index.js`。该文件隐式被认为是该文件夹的“主”模块。

您可以在*文件模块*和*文件夹模块的* Node.js文档中阅读更多信息。

但是，解析非相对模块名称的方式不同。节点将在名为`node_modules`的特殊文件夹中查找您的模块。一个`node_modules`文件夹可以是在同一水平上作为当前文件或目录中的链越往上。Node 将遍历目录链，查看每个`node_modules`目录链，直到找到您尝试加载的模块。

遵循上面的示例，考虑是否`/root/src/moduleA.js`使用非相对路径并进行导入`var x = require("moduleB");`。然后，节点将尝试解析`moduleB`每个位置，直到其中一个工作。

1. `/root/src/node_modules/moduleB.js`
2. `/root/src/node_modules/moduleB/package.json`（如果它指定了一个`"main"`属性）
3. `/root/src/node_modules/moduleB/index.js` 
4. `/root/node_modules/moduleB.js`
5. `/root/node_modules/moduleB/package.json`（如果它指定了一个`"main"`属性）
6. `/root/node_modules/moduleB/index.js` 
7. `/node_modules/moduleB.js`
8. `/node_modules/moduleB/package.json`（如果它指定了一个`"main"`属性）
9. `/node_modules/moduleB/index.js`

请注意，Node.js 在步骤（4）和（7）中跳出了一个目录。

您可以从`node_modules` Node.js文档中了解有关从中加载模块的更多信息。

**TypeScript 如何解析模块**

TypeScript 将模仿 Node.js 运行时解析策略，以便在编译时查找模块的定义文件。按照`.ts`，`.tsx`，和`.d.ts`查找顺序。TypeScript 还将使用`package.json`中的字段`"types"`来反映目的`"main"`- 编译器将使用它来查找“主要”定义文件。

例如，像`import { b } from "./moduleB"`in `/root/src/moduleA.ts`这样的导入语句会导致尝试以下位置进行定位`"./moduleB"`：

1. `/root/src/moduleB.ts`
2. `/root/src/moduleB.tsx`
3. `/root/src/moduleB.d.ts`
4. `/root/src/moduleB/package.json`（如果它指定了一个`"types"`属性）
5. `/root/src/moduleB/index.ts`
6. `/root/src/moduleB/index.tsx`
7. `/root/src/moduleB/index.d.ts`

回想一下，Node.js 寻找一个名为的文件`moduleB.js`，然后是一个适用的`package.json`，然后是一个`index.js`。

同样，非相对导入将遵循 Node.js 解析逻辑，首先查找文件，然后查找适用的文件夹。所以`import { b } from "moduleB"`在源文件中`/root/src/moduleA.ts`会导致以下查找：

1. `/root/src/node_modules/moduleB.ts`
2. `/root/src/node_modules/moduleB.tsx`
3. `/root/src/node_modules/moduleB.d.ts`
4. `/root/src/node_modules/moduleB/package.json`（如果它指定了一个`"types"`属性）
5. `/root/src/node_modules/moduleB/index.ts`
6. `/root/src/node_modules/moduleB/index.tsx`
7. `/root/src/node_modules/moduleB/index.d.ts` 
8. `/root/node_modules/moduleB.ts`
9. `/root/node_modules/moduleB.tsx`
10. `/root/node_modules/moduleB.d.ts`
11. `/root/node_modules/moduleB/package.json`（如果它指定了一个`"types"`属性）
12. `/root/node_modules/moduleB/index.ts`
13. `/root/node_modules/moduleB/index.tsx`
14. `/root/node_modules/moduleB/index.d.ts` 
15. `/node_modules/moduleB.ts`
16. `/node_modules/moduleB.tsx`
17. `/node_modules/moduleB.d.ts`
18. `/node_modules/moduleB/package.json`（如果它指定了一个`"types"`属性）
19. `/node_modules/moduleB/index.ts`
20. `/node_modules/moduleB/index.tsx`
21. `/node_modules/moduleB/index.d.ts`

不要被这里的步骤吓倒 -  TypeScript 仍然只在步骤（8）和（15）跳过两次目录。这实际上并不比 Node.js 本身所做的更复杂。

#### baseUrl: path

非相对路径的模块查找的base路径，需要搭配`paths`配置使用， 这个配置对相对模块不起作用。

#### paths: {}

配置根据`baseUrl`进行查找的路径列表，可为路径起别名，类似 `path alias`

```json
{
	"baseUrl":'./',
    "paths":{
        "*":["node_modules/*"],
        "_cpn/*":["src/components/*"]
    }
}
```

#### rootDirs:[dirPath,dirPath]

多个`rootDir` 合并，最后都会生成到`outDir`指定的文件夹，`rootDirs`最好不和`rootDir`同时配置，可能会造成一定冲突。

#### typeRoots: []

指定声明文件的存放根路径，只有在该配置项下的声明文件才会被加载。

####  types: []

指定需要加载声明文件的模块名，如果一个模块的声明文件存在于`typeRoots`，但模块不存在于`types`，那么模块的声明文件依然不会被加载。

#### allowSyntheticDefaultImports: true|false

是否允许导入 没有使用默认导出 的模块。

#### esModuleInterop: true|false

为所有导入的模块创建命名空间，支持CommonJS和ES模块之间的互操作性，这个选项开启意味着同时开启`allowSyntheticDefaultImports`

#### preserveSymlinks: true|false

不使用符号链接的真实路径

#### allowUmdGlobalAccess: true|false

是否允许在任意模块内使用UMD模块导入的全局变量。



### SourceMap配置

**Source Map Options**

#### sourceRoot:path

指定调试器应该找到的Ts文件位置而不是源文件位置，这个值会被写进.map文件里

#### mapRoot:path

mapRoot用于指定调试器找到映射文件而非生成文件的位置，指定mao文件的根路径，该选项会影响.map文件中的sources属性。

#### inlineSourceMap:true|false

是否将SourceMap文件的内容和写进输出的js文件中。

#### inlineSources:true|false

是否将ts文件的内容也包含到js文件中



### 实验性配置

**Experimental Options**

#### experimentalDecorators:true|false

启用对ES7装饰器的实验性支持。

#### emitDecoratorMetadata:true|false

启用对装饰器发出类型元数据的实验性支持



### 高级配置

**Advanced Options**

#### skipLibCheck: true|false

是否跳过对声明文件`.d.ts`的类型检查

#### forceConsistentCasingInFileNames:true|false

不允许对同一个文件使用不一致格式的引用, ture为不允许，false为允许。