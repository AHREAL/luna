# Luna🌛

基于hexo搭建的个人Blog，存存笔记。

Demo：[Allen | 前端开发](http://182.254.210.149/)

如果你审美和我差不多的话，那么这个项目可以让你5分钟内快速搭建精美的个人博客

⚠️ **由于这是我的个人仓库，改动比较随意！建议不要直接clone，请fork一份代码进行部署**



# 环境

需要提前准备好：

- [Noe.js](https://nodejs.org/en/) （Node.js 版本需不低于 16.14）
- [Git](https://git-scm.com/)

请依照官方文档指引进行安装 👆🏻



# 安装

准备好启动项目所需的软件后，使用npm安装项目依赖。

```bash
npm install
```

如果install较久或者超时，使用镜像源进行安装。

```bash
npm install --registry=https://registry.npmmirror.com
```

依赖安装完成以后，即可启动项目。

```bash
npm run server
```

默认会在本地`4000`端口启动，访问 http://localhost:4000/ 查看效果。

**📢 注意：项目的hexo属于局部安装，如果你希望使用hexo命令，请使用`node_modules/.bin/hexo`**



# 部署

项目还集成了WEB服务器以及进程守护，无需配置开箱即用🔥

```bash
npm run deploy
```

deploy命令会主动pull代码并更新npm依赖，如果你不需要

```bash
npm run start
```


