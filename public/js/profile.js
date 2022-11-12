function getFile(file, type) {
    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/' + type + '/' + file,
        responseType: 'blob',
    }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file);
        document.body.appendChild(link);
        link.click();
    })
}

function sendToLink(url) {
    window.open(url, '_blank').focus();
}