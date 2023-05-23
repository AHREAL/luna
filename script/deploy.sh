echo "🚚 拉取最新代码..."
git pull

echo "🚗 更新npm包..."
npm install

echo "📦️ 打包前端代码..."
npm run build

echo "🌏︎ 启动www服务..."
npm run stop
npm run start

echo "🎉🎉🎉 部署成功!!!"