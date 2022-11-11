window.onload = function() {
    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/user/data',
    }).then((res) => {
        console.log(res.data);
        document.getElementById('name').innerHTML = res.data.name;
        // document.getElementById('number').innerHTML = res.data.number;
        // document.getElementById('enroll').innerHTML = res.data.enroll;
        document.getElementById('userid').innerHTML = '@' + res.data.email.substring(0, res.data.email.indexOf('@'));
        window.username = res.data.name;
        window.usernumber = res.data.number;
    }).catch((err) => {
        console.log(err);
    });
}