const path = require('path')
const fs = require('fs')
const homeDir = require('../working-dir')
const passGenerator = require('generate-password')
const multer = require('multer')
const archiver = require('archiver')
const mv = require('mv')
const date = require('date-and-time')
const ApiError = require('../error/ApiError')
const maxSize = 20971520  //20 MB

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const finalDestination = path.join(homeDir + '/uploads/' + req.password)

        //prvi pur kad se runna napravi mapu, ostale direktno u callback
        fs.access(finalDestination, fs.constants.F_OK, (err) => {
            if(err){
                fs.mkdirSync(finalDestination, {recursive: true})
                cb(null, finalDestination)
            }else{
                cb(null, finalDestination)
            }
          })  
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
var upload = multer({ 
    storage: fileStorage,
    limits:{fileSize: maxSize, files: 10}
 }).array('filesForUpload')


const fileUploading = async (req, res, next) => {
    var passcode = passGenerator.generate({
        length: 7,
        numbers: true
    }).toLowerCase()    

    try {
        await isPasswordTaken(passcode)
    } catch (error) {
        next(ApiError.serverError('Something went wrong, please try again.'))
        return
    }
 
    req.password = passcode
    
    upload(req, res, (err) => {
        if(err){
            console.log(err)
            next(ApiError.badRequest('Too many files or they are too large'))
            return
        }
        zipFolder(passcode)
        //ime je req.body.uploadName, komentar je req.body.uploadcomment
        const now = new Date()
        
        let fileData = {
            name: req.body.uploadName,
            comment: req.body.uploadComment,
            dateOfExpiration: date.addHours(now, 1)
        }
        const toWrite = JSON.stringify(fileData)
        const pathToJsonFile = homeDir + '/database/' + passcode + '.json'
        fs.writeFile(pathToJsonFile, toWrite, (err) => {
            if(err){
                console.log(err)
                res.end()
            }
            res.end(passcode)
        })     
    })  
}

const getFilePath = async (req, res, next) => {
    const {dir: passcode} = req.params
    const filesList = new Array()
    var jsonstring = undefined
    if(!/^[A-Za-z0-9]*$/.test(passcode)){  //provjera da li je password pravilan (samo slova i brojevi)
        next(ApiError.badRequest('You entered an incorrect password.'))
        return
    }

    try {
        fs.readdir(path.join(homeDir + '/uploads/' + passcode), 'utf-8',(err, files) => {
            try {
                files.forEach((file) => {
                    const filename = passcode + '/' + file
                    filesList.push(filename)
                })
                fs.readFile(homeDir + '/database/' + passcode + '.json', (err, data) => {
                    if(err){
                        console.log(err)
                        res.status(500).end('Something went wrong.')
                    }
                    const nameAndComment = JSON.parse(data)
                    filesList.push(nameAndComment)
                    jsonstring = JSON.stringify(Object.assign({}, filesList))
                    res.status(200).send(jsonstring) 
                })
            } catch (error) {
                console.log(error)
                next(ApiError.badRequest('You entered an incorrect code.'))
                return
            }
               
        })
    } catch (error) {
        console.log(error + 'prvi');
        
    } 
}

const fileDownload = async (req, res, next) => {
    const {dir: directory, file: fileName} = req.params
    const filePath = path.join(homeDir + '/uploads/' + directory + '/' + fileName)
    fs.access(filePath, fs.constants.F_OK, (err) => {
        //provjera dal imamo pristup fajlu
        console.log(`${filePath} ${err ? "does not exist" : "exists"}`);
      });
    res.download(filePath, fileName, (err) => {
        if(err){
            console.log(err);
            next(ApiError.serverError('Something went wrong'))
        }
    })
}

const zipFolder = async (passcode) => {
    const source_dir = homeDir + '/uploads/' + passcode + '/'
    const archivePath = homeDir + '/tmp/' + passcode + '.zip'
    var output = fs.createWriteStream(archivePath);
    var archive = archiver('zip');
    output.on('close', function () {
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

const isPasswordTaken = (pass) => {
    var isTaken = false
    return new Promise(function(resolve, reject){
        fs.readdir(path.join(homeDir + '/database/'), 'utf-8',(err, files) => {
            try {
                files.forEach((file) => {
                    if(file.split('.')[0] === pass){
                        isTaken = true
                    }
                })
                if(!isTaken){
                    resolve()
                }else{
                    reject()
                }
            } catch (error) {
                console.log(error);
            }  
    })
    })
    
}

module.exports = {fileUploading, fileDownload, getFilePath}