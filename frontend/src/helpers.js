// reference: helpers.js file from Ass3
import config from './config.json';

export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export const apiCall = (path, inputData = null, token = null, method_ = 'POST') => {
  return new Promise((resolve, reject) => {
    const headers_ = { 'Content-type': 'application/json' };
    // if (token) headers['Authorization'] = `Bearer ${token}`;
    if (token) headers_.Authorization = `Bearer ${token}`;
    const body_ = inputData ? JSON.stringify(inputData) : null;

    fetch(`http://localhost:${config.BACKEND_PORT}/` + path, {
      method: method_,
      headers: headers_,
      body: body_
    }).then((response) => response.json()
    ).then((data) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data);
      }
    });
  });
};
