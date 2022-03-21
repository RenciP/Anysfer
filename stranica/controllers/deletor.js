const fs = require('fs') 
const date = require('date-and-time')
const homeDir = require('../working-dir')
const path = require('path') 

const folderDelete = async () =>{
    fs.readdir(path.join(homeDir + '/database/'), 'utf-8',(err, files) => {
        try {
            files.forEach((file) =>{ 
                try {
                    const fileData = require(homeDir + '/database/' + file)
                    var dateOfExpire = new Date(fileData.dateOfExpiration)
                    const now = new Date()
                    if(date.subtract(now, dateOfExpire).toHours() > 0){
                        const directoryPath = homeDir + '/uploads/' + file.split('.')[0]
                        fs.unlinkSync(homeDir + '/database/' + file)
                        fs.rm(directoryPath, { recursive: true }, (err) => {
                            if (err) {
                                throw err;
                            }
                        });
                }
                } catch (error) {
                    console.log(error);
                }
                
            })
        } catch (error) {
            console.log(error);
        }
        
    })
}

const deleteEmptyDirs = async () =>{
    fs.readdir(path.join(homeDir + '/uploads/'), 'utf-8',(err, directories) => {
        try {
            directories.forEach((dir) =>{
                fs.readdir(homeDir + '/uploads/' + dir, function(err, files) {
                    if (err) {
                       console.log(err);
                    } else {
                       if (!files.length) {
                        fs.rm(homeDir + '/uploads/' + dir, { recursive: true }, (err) => {
                            if (err) {
                                throw err;
                            }
                        })
                       }
                    }
                });
            })
        } catch (error) {
            console.log(error);
        }       
    })
    console.log('Empty dirs deleted')                
}


module.exports = {folderDelete, deleteEmptyDirs}