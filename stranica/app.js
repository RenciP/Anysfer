const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('./routers/routes')


const app = express()

const port = 1092

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(routes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})