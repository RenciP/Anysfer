const uploadUrl = '/api/upload'
const downloadUrl = '/api/download'

const downloadBtnDOM = document.querySelector("#download-btn")
const fileUploadDOM = document.querySelector('.file-upload-form')
const selectFileDOM = document.querySelector('#data-input')
const passcodeDOM = document.querySelector('#passcode')

let fileForUpload

downloadBtnDOM.addEventListener("click", function () {
    console.log(passcodeDOM.value)
    const passcode = passcodeDOM.value
    downloadFile(passcode)
  })


fileUploadDOM.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData()

  formData.append('file', selectFileDOM.files[0])

  console.log(formData.get('file'));

  uploadFile(formData)
})

function uploadFile(file) {
  axios.post('/api/upload', file, {
    headers: {
      'Content-Type':'multipart/form-data'
    }
  }).then(console.log('Fajl uploadan'))
  .catch(function(error){console.log(error)})
}

function downloadFile(passcode){
  console.log(passcode);
  axios.get(downloadUrl, passcode)
  .then(console.log(('File downloaded')))
  .catch(function(error){console.log(error)})
}