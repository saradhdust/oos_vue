import axios from 'axios'

const service = axios.create({
    responseType: 'arraybuffer'
})

service.interceptors.request.use(config => {
    config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    return config
}, error => {
    console.log(error);
})

service.interceptors.response.use(resp => {
    const headers = resp.headers;
    let reg = RegExp(/application\/json/);
    if (headers['content-type'].match(reg)) {
        resp.data = unitToString(resp.data);
    } else {
        let fileDownLoad = require('js-file-download');
        let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
        let contentType = headers['content-type'];
        fileName = decodeURIComponent(fileName);
        fileDownLoad(resp.data, fileName, contentType);
    }
}, error => {
    console.log(error);
})

function unitToString(unitArray) {
    let encodedString = String.fromCharCode.apply(null, Uint8Array(unitArray));
    let decodeString = decodeURIComponent(escape(encodedString));
    return JSON.parse(decodeString);
}

let base = '';
export const downLoadRequest = (url, params) => {
    return service({
        method: 'get',
        url: '${base}${url}',
        data: params
    })
}

export default service;
