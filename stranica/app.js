const express = require('express')
const path = require('path')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const passGenerator = require('generate-password')

const app = express()

const port = 1092

app.use(fileUpload({
    createParentPath: true
}))
app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/api/upload', (req,res) => {
    const file = req.files.file
    const passcode = passGenerator.generate({
        length: 7,
        numbers: true
    })
    fs.mkdir(path.join(__dirname, 'uploads', passcode), (err) => {
        if (err) {
            return console.error(err);
        }
    });
    file.mv('./uploads/' + passcode + '/' + file.name)    
})

app.get('/api/download', (req, res) => {
    const passcode = req.passcode
    console.log(req.body);
    /*fs.readdir(path.join(__dirname, +'uploads' + passcode), 'utf-8',(err, files) => {
        files.forEach((file) => console.log(file.name))
    } )*/
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})