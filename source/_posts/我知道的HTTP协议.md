---
title: 我知道的HTTP协议
date: 2022-08-03 14:12:52
updated: 2020-08-03 18:56:23
tags: 基础遍历
categories: 基础遍历
keywords:
description: 我知道的HTTP协议
top_img: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208031136143.png
comments:
cover: https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208031136143.png
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

## 解析

就像 IP 地址必须转换成 MAC 地址才能访问主机一样，域名也必须要转换成 IP 地址，这个过程就是“**域名解析”**。

DNS 的核心系统是一个三层的树状、分布式服务，基本对应域名的结构：

1. 根域名服务器（Root DNS Server）：管理顶级域名服务器，返回“com”“net”“cn”等顶级域名服务器的 IP 地址；
2. 顶级域名服务器（Top-level DNS Server）：管理各自域名下的权威域名服务器，比如 com 顶级域名服务器可以返回 apple.com 域名服务器的 IP 地址；
3. 权威域名服务器（Authoritative DNS Server）：管理自己域名下主机的 IP 地址，比如 apple.com 权威域名服务器可以返回 www.apple.com 的 IP 地址。

![img](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202208022126817.png)

