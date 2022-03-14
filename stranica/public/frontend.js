document.querySelector("#download-btn").addEventListener("click", function () {
    console.log('Download clicked')
  })

document.querySelector("#upload-btn").addEventListener("click", function () {
    uploadFile()
  })

function uploadFile() {
  axios.post('/api/upload', {
    imeFajla: 'Fajlovo presveto ime',
    sadrzaj: 'sadrzajFajla'
  }).then(console.log('Fajl uploadan'))
  .catch(function(error){console.log(error)})
}