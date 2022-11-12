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
        // getAllPosts();
    }).catch((err) => {
        console.log(err);
    });


    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/user/' + location.pathname.split('/')[2],
    }).then((res) => {
        console.log(res.data);
        document.querySelector('.jumbo-uname').innerHTML = res.data.name;
        document.querySelector('.jumbo-username').innerHTML = '@' + res.data.email.substring(0, res.data.email.indexOf('@'));
        axios({
            method: 'get',
            url: location.protocol + '//' + location.host + '/api/files/get/' + res.data.pic,
            responseType: 'arraybuffer',
            headers: { "Content-Type": res.data.picType }
        }).then((res) => {
            var blob = new Blob([res.data], { type: res.headers['content-type'] });
            var url = window.URL.createObjectURL(blob);
            document.querySelector('.jumbo-dp').src = url;
            window.jumbouserpicurl = url;
            getAllPosts();
        }).catch((err) => {
            console.log(err);
        });

    }).catch((err) => {
        console.log(err);
    });
}

const pic_input = document.getElementById('pic-input');

pic_input.addEventListener('input', (e) => {
    const files = Array.from(e.target.files);
    console.log(files);

    files.forEach(file => {
        const uuid = new uuidv4();
        // allFiles[file.name] = { uuid: uuid, file: file };
        document.querySelector('.profile-pic').src = URL.createObjectURL(file);
        let formData = new FormData();
        // console.log(allFiles[file].file);
        formData.append('file', file);
        formData.append('uuid', uuid);
        axios({
            method: 'post',
            url: location.protocol + '//' + location.host + '/api/user/pic',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    });
})

function changeDP() {
    document.getElementById('pic-input').click();
}

function incrementLikes(id) {
    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/post/incrementlikes',
        data: { postid: id.substring(0, id.indexOf('-')) },
    }).then((res) => {
        console.log(res.data);
        document.getElementById(res.data._id + '-likecount').innerHTML = res.data.likecount;
    }).catch((err) => {
        console.log(err);
    });
}

function getAllPosts() {
    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/post/getallfromid/' + location.pathname.split('/')[2],
    }).then((res) => {
        console.log(res.data);
        res.data.forEach((post) => {
            if (post.img) {
                console.log(post.img, post.imgType);
                axios({
                    method: 'get',
                    url: location.protocol + '//' + location.host + '/api/files/get/' + post.img,
                    responseType: 'arraybuffer',
                    headers: { "Content-Type": post.imgType }
                }).then((res) => {
                    let fileBlob = new Blob([res.data], { type: post.imgType });
                    let url = URL.createObjectURL(fileBlob); //fileBlob has blob
                    const template = document.querySelector('template[data-template="tweet-template"]');
                    const clone = template.content.cloneNode(true);
                    clone.querySelector('.tweet').setAttribute('id', post._id);
                    clone.querySelector('.profile-dp').setAttribute('src', jumbouserpicurl);
                    clone.querySelector('.profile-name').innerHTML = post.name + ' <span class="profile-id">@' + post.username + '</span>';
                    // clone.querySelector('.profile-id').innerHTML = '@' + post.user.email.substring(0, post.user.email.indexOf('@'));
                    clone.querySelector('.tweet-text').innerHTML = '<p>' + post.msg + '<p>' + '<img src="' + url + '" alt="">';
                    clone.querySelector('.tweet-time').innerHTML = new Date(parseInt(post.time)).toString().substring(4, 21);
                    clone.querySelector('.like-count').innerHTML += post.likecount;
                    clone.querySelector('.like-count').setAttribute('id', post._id + '-likecount');
                    clone.querySelector('.like-button').setAttribute('id', post._id + '-likebutton');
                    clone.querySelector('.like-button').setAttribute('onclick', 'incrementLikes(this.id)');
                    document.querySelector('.posts').prepend(clone);


                }).catch((err) => {
                    console.log(err);
                });
            } else {
                const template = document.querySelector('template[data-template="tweet-template"]');
                const clone = template.content.cloneNode(true);
                clone.querySelector('.tweet').setAttribute('id', post._id);
                clone.querySelector('.profile-dp').setAttribute('src', jumbouserpicurl);
                clone.querySelector('.profile-name').innerHTML = post.name + ' <span class="profile-id">@' + post.username + '</span>';
                // clone.querySelector('.profile-id').innerHTML = '@' + post.user.email.substring(0, post.user.email.indexOf('@'));
                clone.querySelector('.tweet-text').innerHTML = '<p>' + post.msg + '<p>';
                clone.querySelector('.tweet-time').innerHTML = new Date(parseInt(post.time)).toString().substring(4, 21);
                clone.querySelector('.like-count').innerHTML += post.likecount;
                clone.querySelector('.like-count').setAttribute('id', post._id + '-likecount');
                clone.querySelector('.like-button').setAttribute('id', post._id + '-likebutton');
                clone.querySelector('.like-button').setAttribute('onclick', 'incrementLikes(this.id)');
                document.querySelector('.posts').prepend(clone);

            }

        });
    }).catch((err) => {
        console.log(err);
    });
}