export default {
  uploadFileToCloudinary(file) {
    return new Promise(function (resolve, reject) {
      let formData = new FormData();
      formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'public_folder');
      formData.append('file', file);

      let request = new XMLHttpRequest();
      request.open('POST', process.env.CLOUDINARY_URL, true);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      request.onreadystatechange = () => {
          // File uploaded successfully
          if (request.readyState === 4 && request.status === 200) {
              let response = JSON.parse(request.responseText);
              resolve(response);
          }

          // Not succesfull, let find our what happened
          if (request.status !== 200) {
              let response = JSON.parse(request.responseText);
              let error = response.error.message;
              alert('error, status code not 200 ' + error);
              reject(error);
          }

      };

      request.onerror = (err) => {
      };

      request.send(formData);
  });
  }
}  
  