const dotenv = require("dotenv")
dotenv.config()

const https = require('https');
const http = require('http');
const fs = require('fs');
const { Buffer } = require('buffer');
const childrenProcess = require('child_process')
const bodyParser = require('body-parser')
const crypto = require('crypto');
const express = require('express')

const app = express()
const httpApp = express()
const httpPort = 80
const httpsPort = 443
const HUB_SECRET = process.env.HUB_SECRET;
const httpsOptions = {
  key:fs.readFileSync('./cert/js-coder.cn.key'),
  cert:fs.readFileSync('./cert/js-coder.cn.crt')
}
const httpsServer = https.createServer(httpsOptions,app);
const httpServer = http.createServer(httpApp);

/** http重定向https */
httpApp.all('*', function (req, res, next) {
  if(req.protocol !== 'https') {
    return res.redirect(301, 'https://' + req.get('host') + req.originalUrl);
  }
  return next();
})

/** 解析body */
app.use(bodyParser.json())

/** 静态资源 */
app.use(express.static('./public'))

/** 执行命令 */
const exec = (bash) => {
  console.log(`🔧 开始执行命令 ${bash}`)
  return new Promise((resolve, reject) => {
    childrenProcess.exec(bash, (error, stdout, stderr) => {
      if (error) {
        console.error(`🔧 命令出错 ${bash} exec error: ${error}`);
        reject()
        return
      }
      console.log(`🔧 命令完成 ${bash} stdout: ${stdout} stderr: ${stderr}`);
      resolve()
    })
  })
}

/** 校验sig */
const validateHubSig = (req) => {
  try {
    if (!req.body) return false
    const signature = Buffer.from(`sha1=${crypto.createHmac('sha1', HUB_SECRET).update(JSON.stringify(req.body)).digest('hex')}`)
    const _signature = Buffer.from(req.headers['x-hub-signature'])
    if (signature.length !== _signature.length) {
      return false
    }
    return crypto.timingSafeEqual(signature, _signature)
  } catch (error) {
    console.error('validateHubSigFail', error)
    return false
  }
}

/** webhook - 自动刷新 */
app.post('/refresh', (req, res) => {
  if (validateHubSig(req)) {
    console.log('🏂 webhook自动刷新触发，正在执行...')
    exec('git pull')
      .then(exec.bind(this, 'npm install'))
      .then(exec.bind(this, 'npm run build'))
      .then(() => {
        console.log('🎉 自动刷新完成!')
      }).catch(() => {
        console.log('❌ 自动刷新失败，请查看日志详情!')
      })
    res.status(200).send({
      msg:'webhook success'
    })
  }
  res.status(400).send({
    msg: 'validate signature fail'
  });
})

httpsServer.listen(httpsPort, () => {
  console.log(`app listening on port ${httpsPort}`)
})

httpServer.listen(httpPort, ()=>{
  console.log(`app listening on port ${httpPort}`)
})