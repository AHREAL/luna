echo "\n🚚 拉取最新代码...\n"
git pull

echo "\n🚗 更新npm包...\n"
npm install

echo "\n📦️ 打包前端代码...\n"
npm run build

echo "\n🌏︎ 启动www服务...\n"
npm run stop
npm run start

echo "\n🎉🎉🎉 部署成功!!!\n"