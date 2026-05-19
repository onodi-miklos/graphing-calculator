const express = require('express')
const path = require('path')

const app = express()

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(path.join(__dirname, "../frontend/"))
]);

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
})

app.all(/.*/, (req, res) => {
  res.status(404).send('source not found')
})

app.listen(5000, () => {
  console.log('server listening on port 5000....')
})