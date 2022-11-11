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
        getAllPosts();
    }).catch((err) => {
        console.log(err);
    });
}

function createPost() {
    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/post/create',
        data: { msg: document.getElementById('newPostMsg').value, username: username, name: uname, time: Date.now() },
    }).then((res) => {
        console.log(res.data);
        document.getElementById('newPostMsg').value = '';
        const template = document.querySelector('template[data-template="tweet-template"]');
        const clone = template.content.cloneNode(true);
        clone.querySelector('.tweet').setAttribute('id', res.data._id);
        clone.querySelector('.profile-name').innerHTML = window.name + ' <span class="profile-id">@' + window.username + '</span>';
        // clone.querySelector('.profile-id').innerHTML = '@' + window.username;
        clone.querySelector('.tweet-text').innerHTML = res.data.msg;
        clone.querySelector('.tweet-time').innerHTML = new Date(parseInt(res.data.time)).toString().substring(4, 21);
        clone.querySelector('.like-count').innerHTML = res.data.likecount;
        clone.querySelector('.like-count').setAttribute('id', res.data._id + '-likecount');
        clone.querySelector('.like-button').setAttribute('id', res.data._id + '-likebutton');
        clone.querySelector('.like-button').setAttribute('onclick', 'incrementLikes(this.id)');
        document.querySelector('.posts').prepend(clone);
    }).catch((err) => {
        console.log(err);
    });
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
        url: location.protocol + '//' + location.host + '/api/post/getall',
    }).then((res) => {
        console.log(res.data);
        res.data.forEach((post) => {
            const template = document.querySelector('template[data-template="tweet-template"]');
            const clone = template.content.cloneNode(true);
            clone.querySelector('.tweet').setAttribute('id', post._id);
            clone.querySelector('.profile-name').innerHTML = post.name + ' <span class="profile-id">@' + post.username + '</span>';
            // clone.querySelector('.profile-id').innerHTML = '@' + post.user.email.substring(0, post.user.email.indexOf('@'));
            clone.querySelector('.tweet-text').innerHTML = post.msg;
            clone.querySelector('.tweet-time').innerHTML = new Date(parseInt(post.time)).toString().substring(4, 21);
            clone.querySelector('.like-count').innerHTML += post.likecount;
            clone.querySelector('.like-count').setAttribute('id', post._id + '-likecount');
            clone.querySelector('.like-button').setAttribute('id', post._id + '-likebutton');
            clone.querySelector('.like-button').setAttribute('onclick', 'incrementLikes(this.id)');
            document.querySelector('.posts').prepend(clone);
        });
    }).catch((err) => {
        console.log(err);
    });
}