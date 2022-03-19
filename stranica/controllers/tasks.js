const path = require('path')
const fs = require('fs')
const homeDir = require('../working-dir')
const passGenerator = require('generate-password')
const multer = require('multer')
const archiver = require('archiver')
const mv = require('mv')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const finalDestination = path.join(homeDir + '/uploads/' + req.password)
        console.log('Func inside multer')
      cb(null, finalDestination)   //passat unutra passcode
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
var upload = multer({ storage: storage }).array('filesForUpload')


const fileUploading = async (req, res) => {
    const passcode = passGenerator.generate({
        length: 7,
        numbers: true
    }).toLowerCase()
    
    req.password = passcode

    fs.mkdir(path.join(homeDir + '/uploads/' + req.password), (err) => {
        if(err){
            console.log(err)
        }
    })

    

    upload(req, res, (err) => {
        if(err){
            console.log(err)
            res.end('An error occured')
        }
        zipFolder(passcode)
        res.end(passcode)
    })
    
}

const getFilePath = async (req, res) => {
    const passcode = req.body.password
    const filesList = new Array()
    var jsonstring = undefined
    try {
        fs.readdir(path.join(homeDir + '/uploads/' + passcode), 'utf-8',(err, files) => {
            try {
                files.forEach((file) => {
                    const filename = passcode + '/' + file
                    filesList.push(filename)
                })
                jsonstring = JSON.stringify(Object.assign({}, filesList))
                console.log(jsonstring)
                res.send(jsonstring)
            } catch (error) {
                console.log(error)
                res.status(400).end('You entered an incorrect code.')
            }
               
        })
    } catch (error) {
        console.log(error + 'prvi');
        
    } 
}

const fileDownload = async (req, res) => {
    const {dir: directory, file: fileName} = req.params
    const filePath = path.join(homeDir + '/uploads/' + directory + '/' + fileName)
    fs.access(filePath, fs.constants.F_OK, err => {
        //provjera dal imamo pristup fajlu
        console.log(`${filePath} ${err ? "does not exist" : "exists"}`);
      });
    res.download(filePath, fileName, (err) => {
        if(err){
            console.log(err);
            res.end()
        }
    })
}

const zipFolder = async (passcode) => {
    const source_dir = homeDir + '/uploads/' + passcode + '/'
    const archivePath = homeDir + '/tmp/' + passcode + '.zip'
    var output = fs.createWriteStream(archivePath);
    var archive = archiver('zip');
    output.on('close', function () {
        console.log('archiver has been finalized and the output file descriptor has closed.')
        mv(archivePath, source_dir + 'allfiles.zip', (err) =>{
            if(err){
                console.log(err + 'Evo errora')
            }  
        })
    });
    archive.on('error', function(err){
        throw err;
    })
    archive.pipe(output)
    archive.directory(source_dir, false)
    archive.finalize()   
}

module.exports = {fileUploading, fileDownload, getFilePath}