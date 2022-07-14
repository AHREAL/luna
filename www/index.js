const express = require('express')
const app = express()
const port = 80

app.use(express.static('./public'))

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})