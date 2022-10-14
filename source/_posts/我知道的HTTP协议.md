---
title: 我知道的HTTP协议
date: 2022-08-03 14:12:52
updated: 2020-08-11 17:26:23
tags: 基础遍历
categories: 基础遍历
keywords:
description: 我知道的HTTP协议
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208041805825.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208041805825.png
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

# HyperText Transfer Protocol

超文本传输协议

## 协议

为了实现相同的目标，约束多方参与人的行为。

即你想参与进某一件事，那么就得遵守这件事所定下的标准，才能流畅和第三方合作。

http本身就是一份协议，是交流通信的规范，以及各种控制和错误的处理方式。

## 传输

传输是个动词，表示把某些数据从A搬运到B，A为请求方，B为应答方，一应一答，就实现了数据了搬运。
所以 **传输** 表示http是用于描述两点之间传输数据的协议

## 超文本

表示http传输的不是普通的文本，而是文字、图片、音频和视频等的混合体

总结下来就是：

**HTTP 是一个在计算机世界里专门在两点之间传输文字、图片、音频、视频等超文本数据的约定和规范。**



# TCP/IP网络分层模型

**分层图例**

![img](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208021709599.png)

TCP/IP网络分层就是我们常说的四层协议，模型是一个自下而上的模型，每层协议都依托下层协议的支持。



## link 链接层

底层网络协议，工作在网卡层级，传输原始数据包，使用MAC地址来标记。

## internet 网际层

又叫“网络互连层”，IP协议所在的分层，描述了如何将各个小型的本地网络，串联起来。用IP地址取代MAC地址，在需要寻找某一个具体设备时，在通过IP地址转换成MAC地址。

## transport 传输层

描述两个IP地址之间如何进行传输，TCP/UDP工作在这层。

TCP 是一个有状态的协议，需要先与对方建立连接然后才能发送数据，而且保证数据不丢失不重复。

而 UDP 则比较简单，它无状态，不用事先建立连接就可以任意发送数据，但不保证数据一定会发到对方。两个协议的另一个重要区别在于数据的形式。

TCP 的数据是连续的“字节流”，有先后顺序，而 UDP 则是分散的小数据包，是顺序发，乱序收。

## application 应用层

SSH、FTP、SMTP 、HTTP等

MAC 层的传输单位是帧（frame），IP 层的传输单位是包（packet），TCP 层的传输单位是段（segment），HTTP 的传输单位则是消息或报文（message）。但这些名词并没有什么本质的区分，可以统称为数据包。



# OSI网络分层模型

即为七层协议**，OSI，全称是“开放式系统互联通信参考模型”**

![img](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208021807517.png)

OSI也是一个自底向上的协议栈

1. 第一层：物理层，网络的物理形式，例如电缆、光纤、网卡、集线器等等；
2. 第二层：数据链路层，它基本相当于 TCP/IP 的链接层；
3. 第三层：网络层，相当于 TCP/IP 里的网际层；
4. 第四层：传输层，相当于 TCP/IP 里的传输层；
5. 第五层：会话层，维护网络中的连接状态，即保持会话和同步；
6. 第六层：表示层，把数据转换为合适、可理解的语法和语义；
7. 第七层：应用层，面向具体的应用传输数据。

OSI更多是一个理论层面的模型，实际现实中跑的更多还是TCP/IP模型。



# TCP/IP协议栈工作方式

![img](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208022042069.png)

一些数据的发送，需要自顶向下层层封包，加上TCP头，IP头、MAC头，再经过链接层传输到远端，远端收到数据包以后，再自底向上层层解包，最终到达应用层。

层的传输过程对于上层是完全“透明”的，上层也不需要关心下层的具体实现细节，所以就 HTTP 层次来看，它不管下层是不是 TCP/IP 协议，看到的只是一个可靠的传输链路，只要把数据加上自己的头，对方就能原样收到。



# 域名

我们都知道，访问一个服务，我们可以通过公网ip地址找到，但是ip地址是纯数字组成，难以记忆。所以就诞生了域名，域名是一串用“.”分隔的多个单词，最右边的被称为“顶级域名”，然后是“二级域名”，层级关系向左依次降低。

## DNS解析

就像 IP 地址必须转换成 MAC 地址才能访问主机一样，域名也必须要转换成 IP 地址，这个过程就是“**域名解析”**。

由左到右，挨个查询。

DNS 的核心系统是一个三层的树状、分布式服务，基本对应域名的结构：

1. 根域名服务器（Root DNS Server）：管理顶级域名服务器，返回“com”“net”“cn”等顶级域名服务器的 IP 地址；
2. 顶级域名服务器（Top-level DNS Server）：管理各自域名下的权威域名服务器，比如 com 顶级域名服务器可以返回 apple.com 域名服务器的 IP 地址；
3. 权威域名服务器（Authoritative DNS Server）：管理自己域名下主机的 IP 地址，比如 apple.com 权威域名服务器可以返回 IP 地址。

![img](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208022126817.png)



## DNS缓存

各大运营商，或者公司内网会自己搭建DNS服务器，作为用户DNS查询的代理，代替访问DNS核心系统。
一般来说，如果之前查询过的域名，则会缓存查询结果的IP地址，从而加快DNS解析的速度。

并且操作系统也会自己记录DNS解析的记录，并写入host文件，以后再访问这个域名，就可以直接拿到本地记录的IP地址了。



# 报文结构

HTTP报文是一个**纯文本**协议，所有头数据都是ASCII码文本。

HTTP报文分为**请求报文**和**响应报文**，首先两种报文的结构一致，只有在头上有所区别。

结构：

![img](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208111713734.png)

1. 起始行：描述请求或响应的基本信息
2. 头字段（头部）：使用key：value描述报文
3. 消息正文（实体）：实际传输的数据，不一定是文本，也可以是二进制数据

**请求行**

请求的起始行也叫请求行，由三部分构成：

![img](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208111641716.png)

1. 请求方法：是一个动词，如 GET/POST，表示对资源的操作；
2. 请求目标：通常是一个 URI，标记了请求方法要操作的资源；
3. 版本号：表示报文使用的 HTTP 协议版本。

**状态行**

响应的起始行也叫状态行，由三部分构成：

![img](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208111643511.png)

1. 版本号：表示报文使用的 HTTP 协议版本；
2. 状态码：一个三位数，用代码的形式表示处理的结果，比如 200 是成功，500 是服务器错误；
3. 原因：作为数字状态码补充，是更详细的解释文字，帮助人理解原因。

**头字段**

![image-20220811171117892](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208111711933.png)

头部字段是 key-value 的形式，key 和 value 之间用“:”分隔，最后用 CRLF 换行表示字段结束。

HTTP 协议规定了非常多的头部字段，实现各种各样的功能，但基本上可以分为四大类：

1. 通用字段：在请求头和响应头里都可以出现；
2. 请求字段：仅能出现在请求头里，进一步说明请求信息或者额外的附加条件；
3. 响应字段：仅能出现在响应头里，补充说明响应报文的信息；
4. 实体字段：它实际上属于通用字段，但专门描述 body 的额外信息。



# Method

Method表示一次请求执行的具体动作，比如是获取，更改，还是删除等。

目前 HTTP/1.1 规定了八种方法。

1. GET：获取资源，可以理解为读取或者下载数据；
2. HEAD：获取资源的元信息；
3. POST：向资源提交数据，相当于写入或上传数据；
4. PUT：类似 POST；
5. DELETE：删除资源；
6. CONNECT：建立特殊的连接隧道；
7. OPTIONS：列出可对资源实行的方法；
8. TRACE：追踪请求 - 响应的传输路径。



**GET/HEAD**

HEAD 方法与 GET 方法类似，也是请求从服务器获取资源，服务器的处理机制也是一样的，但服务器不会返回请求的实体数据，只会传回响应头，也就是资源的 **元信息**。

HEAD 方法可以看做是 GET 方法的一个“简化版”或者“轻量版”。因为它的响应头与 GET 完全相同，所以可以用在很多并不真正需要资源的场合，避免传输 body 数据的浪费。

**PUT/POST**

PUT 的作用与 POST 类似，也可以向服务器提交数据，但与 POST 存在微妙的不同，通常 POST 表示的是**“新建”“create”**的含义，而 PUT 则是**“修改”“update”**的含义。

在实际应用中，PUT 用到的比较少。而且，因为它与 POST 的语义、功能太过近似，有的服务器甚至就直接禁止使用 PUT 方法，只用 POST 方法上传数据。



## 安全

在 HTTP 协议里，**“安全”** 是指请求方法不会“破坏”服务器上的资源，即不会对服务器上的资源造成实质的修改。

按照这个定义，只有 GET 和 HEAD 方法是“安全”的，因为它们是“只读”操作，只要服务器不故意曲解请求方法的处理方式，无论 GET 和 HEAD 操作多少次，服务器上的数据都是“安全的”。

而 POST/PUT/DELETE 操作会修改服务器上的资源，增加或删除数据，所以是“不安全”的。



## 幂等

**“幂等”** 实际上是一个数学用语，被借用到了 HTTP 协议里，意思是多次执行相同的操作，结果也都是相同的，即多次“幂”后结果“相等”。

很显然，GET 和 HEAD 既是安全的也是幂等的，DELETE 可以多次删除同一个资源，效果都是“资源不存在”，所以也是幂等的。

按照 RFC 里的语义，POST 是“新增或提交数据”，多次提交数据会创建多个资源，所以不是幂等的；而 PUT 是“替换或更新数据”，多次更新一个资源，资源还是会第一次更新的状态，所以是幂等的。



# MIME

HTTP是一个超文本传输协议，超文本即指可传输文字、音频、视频等数据。



## MIME type

**MIME type**则用于描述传输的数据类型，常用的有：

1. text：即文本格式的可读数据，我们最熟悉的应该就是 text/html 了，表示超文本文档，此外还有纯文本 text/plain、样式表 text/css 等。
2. image：即图像文件，有 image/gif、image/jpeg、image/png 等。
3. audio/video：音频和视频数据，例如 audio/mpeg、video/mp4 等。
4. application：数据格式不固定，可能是文本也可能是二进制，必须由上层应用程序来解释。常见的有 application/json，application/javascript、application/pdf 等，另外，如果实在是不知道数据是什么类型，像刚才说的“黑盒”，就会是 application/octet-stream，即不透明的二进制数据。



## Encoding type

为了减少实体数据的体积，通常发送方会对数据进行压缩，还有一个 **Encoding type** 来描述使用什么编码格式进行的压缩，通常有以下几种：

1. gzip：GNU zip 压缩格式，也是互联网上最流行的压缩格式；
2. deflate：zlib（deflate）压缩格式，流行程度仅次于 gzip；
3. br：一种专门为 HTTP 优化的新压缩算法（Brotli）。



## 头字段

上面介绍了几种常见的MIME类型，而HTTP中对于MIME这个类型规范的使用，主要用于**Accept 请求头字段和两个 Content 实体头字段**，用于客户端和服务器的**内容协商**，客户通在请求头中使用Accept标识自己能识别什么MIME类型，而服务端在响应头中使用Content来标识自己返回的数据MIME类型。

```tex
- 请求能接受的MIME类型
Accept: text/html,application/xml,image/webp,image/png

- 响应发送的MIME类型
Content-Type: text/html

- 请求能接受的压缩编码
Accept-Encoding: gzip, deflate, br

- 响应使用的压缩编码
Content-Encoding: gzip
```





