const express = require('express')
const path = require('path')
const app = express()

const port = 1092

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/api/upload', (req,res) => {
    console.log(req.body)    
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})