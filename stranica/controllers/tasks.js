const path = require('path')
const fs = require('fs')
const homeDir = require('../working-dir')
const passGenerator = require('generate-password')
const axios = require('axios')
const multer = require('multer')

const upload = multer({ dest: './public/data/uploads/' })


const fileUploading = async (req, res) => {
    const file = req.files.file
    const passcode = passGenerator.generate({
        length: 7,
        numbers: true
    }).toLowerCase()
    fs.mkdir(path.join(homeDir, 'uploads', passcode), (err) => {
        console.log(path.join(homeDir, 'uploads', passcode));
        if (err) {
            return console.error(err);
        }
        file.mv(homeDir + '/uploads/' + passcode + '/' + file.name)
        console.log(homeDir + '/uploads/' + passcode + '/' + file.name)
    })
    res.send(passcode)
}

const getFilePath = async (req, res) => {
    const passcode = req.body.password
    try {
        fs.readdir(path.join(homeDir + '/uploads/' + passcode), 'utf-8',(err, files) => {
            files.forEach((file) => {
                const filename = passcode + '/' + file
                try {
                    res.send(filename)
                } catch (error) {
                    console.log(error);
                }
            })   
        })
    } catch (error) {
        console.log(error);
        res.end()
    }
}

const fileDownload = async (req, res) => {
    const {dir: directory, file: fileName} = req.params
    const filePath = path.join(homeDir + '/uploads/' + directory + '/' + fileName)
    fs.access(filePath, fs.constants.F_OK, err => {
        //check that we can access  the file
        console.log(`${filePath} ${err ? "does not exist" : "exists"}`);
      });
    res.download(filePath, fileName, (err) => {
        if(err){
            console.log(err);
            res.end()
        }
    })
}

module.exports = {fileUploading, fileDownload, getFilePath}