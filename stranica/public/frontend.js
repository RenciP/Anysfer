const uploadUrl = '/api/upload'
const downloadUrl = '/api/download'

var uploadItemsForm = document.getElementById('upload-items-form')
var downloadItemsList = document.getElementById('download-items-list')
var itemsFiles = document.getElementById('items-files')
var codetext = document.getElementById('codetext')
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalCode = document.getElementById('modal-code')
var downloadErrorMessage = document.getElementById('download-error-message')
const downloadBtnDOM = document.querySelector("#download-btn")
const fileUploadDOM = document.querySelector('#uploadForm')
const selectFileDOM = document.querySelector('#data-input')
const showUploadFormBtnDOM = document.querySelector('#show-upload-form-btn')
const passcodeDOM = document.querySelector('#passcode')

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

  if(nrOfFiles == 0){
    uploadItemsForm.append('Select at least one file to upload!')
    return
  }

  for (let i = 0; i < nrOfFiles; i++) {
    formData.append('filesForUpload', selectFileDOM.files[i])
  }
  
  console.log(formData.getAll('filesForUpload'));

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
    for(const item in res.data){
      const breakLineEl = document.createElement('br')
      const fileName = res.data[item].split('/')
      const linkElement = document.createElement('a')
      linkElement.href = downloadUrl + '/' + res.data[item]
      linkElement.innerText = fileName[1]
      linkElement.className = 'btn btn-primary'
      downloadItemsList.append(linkElement)
      downloadItemsList.append(breakLineEl)
    }
  })
  .catch((error) =>{
    if(error.response.status = 400){
      downloadErrorMessage.innerText = 'You entered an invalid code!'
    }
    return
  })
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  codetext.style.display = 'none'
  downloadItemsList.style.display = 'none'
  uploadItemsForm.style.display = 'none'
  downloadItemsList.innerHTML = '<p>Files that can be downloaded:</p>'
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    codetext.style.display = 'none'
    downloadItemsList.style.display = 'none'
    uploadItemsForm.style.display = 'none'
    downloadItemsList.innerHTML = '<p>Files that can be downloaded:</p>'
  }
} 