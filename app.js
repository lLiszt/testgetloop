const express = require('express')
const app = express()
const port = 4000
app.post('/webhook', (req, res) => res.sendStatus(200))
app.listen(port)