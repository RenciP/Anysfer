const uploadUrl = '/api/upload'
const downloadUrl = '/api/download'

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalCode = document.getElementById('modal-code')
const downloadBtnDOM = document.querySelector("#download-btn")
const fileUploadDOM = document.querySelector('.file-upload-form')
const selectFileDOM = document.querySelector('#data-input')
const passcodeDOM = document.querySelector('#passcode')

let fileForUpload

downloadBtnDOM.addEventListener("click", function () {
    const passcode = passcodeDOM.value
    downloadFile(passcode)
  })


fileUploadDOM.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData()

  formData.append('file', selectFileDOM.files[0])

  console.log(formData.get('file'));

  uploadFile(formData)

  modal.style.display = 'block'
})

function uploadFile(file) {
  axios.post('/api/upload', file, {
    headers: {
      'Content-Type':'multipart/form-data'
    }
  }).then((res) =>{
    modalCode.innerText = res.data
  })
  .catch(function(error){console.log(error)})
}

function downloadFile(passcode){
  console.log(passcode);
  const payload = {"password" : passcode.toLowerCase()}
  axios.post(downloadUrl, payload, {
    headers : {'Content-Type' : 'application/json'}
  })
  .then((res) => {
    console.log(res.data)
    window.open(downloadUrl + '/' + res.data)
  })
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 