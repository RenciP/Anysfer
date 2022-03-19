const uploadUrl = '/api/upload'
const downloadUrl = '/api/download'

showUploadFormBtnDOM.addEventListener('click', function (){
  modal.style.display = 'block'
  uploadItemsForm.style.display = 'block'
})

downloadBtnDOM.addEventListener("click", function () {
    const passcode = passcodeDOM.value
    downloadErrorMessage.innerText = ''
    if(passcode.length != 7){
      downloadErrorMessage.innerText = 'Please enter a code that is 7 characters long.'
      return
    }
    getListOfFiles(passcode)
  })


fileUploadDOM.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData()
  const nrOfFiles = selectFileDOM.files.length

  uploadErrorMessage.innerText = ''

  if(uploadName.value === ''){
    uploadErrorMessage.innerText = 'Please type in the name of your folder.'
    return
  }

  if(uploadComment.value === ''){
    uploadErrorMessage.innerText = 'Please type in a short comment.'
    return
  }

  formData.append('uploadName', uploadName.value)
  formData.append('uploadComment', uploadComment.value)

  if(nrOfFiles == 0){
    uploadErrorMessage.innerText = 'Select at least one file to upload!'
    return
  }

  for (let i = 0; i < nrOfFiles; i++) {
    formData.append('filesForUpload', selectFileDOM.files[i])
  }

  uploadErrorMessage.innerText = ''

  uploadFile(formData)

  modal.style.display = 'block'
})

function uploadFile(file) {
  axios.post(uploadUrl, file, {
    headers: {
      'Content-Type':'multipart/form-data'
    }
  }).then((res) =>{
    codetext.style.display = 'block'
    modalCode.innerText = res.data
  })
  .catch(function(error){console.log(error)})
}

function getListOfFiles(passcode){
  const payload = {"password" : passcode.toLowerCase()}
  axios.post(downloadUrl, payload, {
    headers : {'Content-Type' : 'application/json'}
  })
  .then((res) => {
    modal.style.display = 'block'
    downloadItemsList.style.display = 'block'
    var itemsFiles = document.getElementById('items-files')
    var downloadName = document.getElementById('download-name')
    var downloadComment = document.getElementById('download-comment')
    for(const item in res.data){
      if(typeof res.data[item] == 'object'){
        downloadName.value = res.data[item].name
        downloadComment.value = res.data[item].comment
        console.log('usli u if');
        continue
      }
      const fileName = res.data[item].split('/')
      const breakLineEl = document.createElement('br')
      const linkElement = document.createElement('a')
      if(fileName[1] === 'allfiles.zip'){
        linkElement.href = downloadUrl + '/' + res.data[item]
        linkElement.innerText = 'Download all files in ZIP format'
        linkElement.className = 'btn btn-secondary'
        downloadItemsList.append(breakLineEl)
        downloadItemsList.append(linkElement)
        continue
      }
      linkElement.href = downloadUrl + '/' + res.data[item]
      linkElement.innerText = fileName[1]
      linkElement.className = 'btn btn-primary'
      itemsFiles.append(linkElement)
      itemsFiles.append(breakLineEl)
    }
  })
  .catch((error) =>{
    if(error.response.status = 400){
      downloadErrorMessage.innerText = 'You entered an invalid code!'
    }
    return
  })
}

function modalClose() {
  modal.style.display = "none";
  codetext.style.display = 'none'
  downloadItemsList.style.display = 'none'
  uploadItemsForm.style.display = 'none'
  downloadItemsList.innerHTML = 'Name<br><input id="download-name" class="form-control" type="text" value="" readonly><br>Comment<br><input id="download-comment" class="form-control" type="text" value="" readonly><br><p>Files that can be downloaded:</p><div id="items-files"></div>'
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modalClose()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modalClose()
  }
}