const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const passGenerator = require('generate-password')
const axios = require('axios')
const routes = require('./routers/routes')


const app = express()

const port = 1092

app.use(fileUpload({
    createParentPath: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(routes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})