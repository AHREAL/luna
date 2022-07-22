# Luna🌛

基于hexo搭建的个人Blog，存存笔记。

Demo：[Allen | 前端开发](https://js-coder.cn/)

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



# 手动部署

项目还集成了WEB服务器以及进程守护，无需配置开箱即用🔥

```bash
npm run deploy
```

deploy命令会主动pull代码并更新npm依赖，如果你不需要

```bash
npm run start
```



# 自动部署

项目提供了一个基于webhook的自动部署方式🏂，可以在推送代码之后，自动触发构建。

这种方式需要一点配置工作：

1. 创建github webhook

在仓库Settings/Webhooks -> 点击 **Add webhooks**

![image-20220721193007310](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202207211930351.png)

**📝 关于Secret随便写一个就行了，注意保存好，一会还要用到。**

2. 设置环境变量

登录机器，在项目根目录下，创建.env文件

```bash
cd luna
vim .env
```

写入在第一步中填写的**Secret**

```tex
HUB_SECRET=你的Secret
```

保存并退出。

3. 测试是否生效

   首先本地任意commit，push到github。

   进入Settings/Webhooks，找到刚刚创建的webhook点**Edit**

   ![image-20220721193950494](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202207211939531.png)

   点击**Recent Deliveries**

   ![image-20220721194534142](https://sls-cloudfunction-ap-guangzhou-code-1300044145.file.myqcloud.com/upload/202207211945182.png)

如果看到`webhook success`，那么恭喜🎉~ 

⚠️ **自动部署仅支持重新构建blog相关的commit。**

​	

