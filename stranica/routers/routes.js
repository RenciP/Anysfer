const express = require('express')
const router = express.Router()
const {fileUploading, fileDownload, getFilePath} = require('../controllers/tasks')

router.route('/api/upload').post(fileUploading)
router.route('/api/download/:dir').get(getFilePath)
router.route('/api/download/:dir/:file').get(fileDownload)

module.exports = router