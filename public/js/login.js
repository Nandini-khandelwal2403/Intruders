function register() {
    console.log("Hello log start");
    const name = document.querySelector("#first_name").value;
    const enrollment_num = document.querySelector("#last_name").value;
    const email = document.querySelector("#email").value;
    const mobile = document.querySelector("#phone").value;
    const password = document.querySelector("#password").value;
    console.log("Hello log");
    const obj = { 'name': name, 'enroll': enrollment_num, 'email': email, 'number': mobile, 'password': password };
    console.log(obj);
    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/user/register',
        data: obj
    }).then((res) => {
        console.log(res);
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
    })
}