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

window.onload = function() {
    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/user/data',
    }).then((res) => {
        console.log(res.data);
        document.getElementById('name').innerHTML = res.data.name;
        // document.getElementById('number').innerHTML = res.data.number;
        // document.getElementById('enroll').innerHTML = res.data.enroll;
        document.getElementById('username').innerHTML = '@' + res.data.email.substring(0, res.data.email.indexOf('@'));
        window.uname = res.data.name;
        window.username = res.data.email.substring(0, res.data.email.indexOf('@'));
        window.usernumber = res.data.number;
        window.userid = res.data._id;
        window.userpic = res.data.pic;
        window.userpicType = res.data.picType;
        axios({
            method: 'get',
            url: location.protocol + '//' + location.host + '/api/files/get/' + res.data.pic,
            responseType: 'arraybuffer',
            headers: { "Content-Type": res.data.picType }
        }).then((res) => {
            var blob = new Blob([res.data], { type: res.headers['content-type'] });
            var url = window.URL.createObjectURL(blob);
            document.querySelector('.profile-pic').src = url;
            window.userpicurl = url;
        }).catch((err) => {
            console.log(err);
        });
        getAllPosts();
    }).catch((err) => {
        console.log(err);
    });


    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/user/' + location.pathname.split('/')[2],
    }).then((res) => {
        console.log(res.data);
    }).catch((err) => {
        console.log(err);
    });
}