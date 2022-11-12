function getIn() {
    console.log("Hello log start");
    const name = document.querySelector("#first_name").value;
    const enrollment_num = document.querySelector("#last_name").value;
    const email = document.querySelector("#email").value;
    const mobile = document.querySelector("#phone").value;
    const program = document.querySelector("#program").value;
    const year = document.querySelector("#year").value;
    const branch = document.querySelector("#branch").value;
    const password = document.querySelector("#password").value;
    console.log("Hello log");
    const obj = { 'name': name, 'enroll': enrollment_num, 'email': email, 'program': program, 'year': year, 'branch': branch, 'number': mobile, 'password': password };
    console.log(obj);
    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/user/register',
        data: obj
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        alert("Correct your credentials");
    })
}

function login() {
    const mobile = document.querySelector("#phone_log").value;
    const password = document.querySelector("#password_log").value;

    const obj = { 'number': mobile, 'password': password };
    console.log(obj);
    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/user/login',
        data: obj
    }).then((res) => {
        console.log(res.data.userData);
        window.location.href = location.protocol + '//' + location.host + '/feed';
    }).catch((err) => {
        console.log(err);
    });
}