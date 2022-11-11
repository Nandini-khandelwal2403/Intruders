// $("#submitComplaint_type").on("change", function() {
//     $(".content-type-info").addClass("hide");
//     $("#" + $(this).val()).removeClass("hide");
// });


function complainForm() {
    if (document.details.NAME.value == "") {
        alert("Please provide your Name!");
        document.details.NAME.focus();
        return false;
    }
    if (document.details.EMAIL.value == "") {
        alert("Please enter a valid Email  ");
        document.details.EMAIL.focus();
        return false;
    }
    if (document.details.ENROLLMENT.value == "") {
        alert("Please provide your Enrollment no");
        document.details.ENROLLMENT.focus();
        return false;
    }
    if (document.details.MSGS.value == "") {
        alert("Please tell us about your complaints");
        document.details.MSGS.focus();
        return false;
    }
    const name = document.querySelector(".com-name").value;
    const email = document.querySelector(".com-email").value;
    const enroll = document.querySelector(".com-enroll").value;
    const type = document.querySelector("#submitComplaint_type").value;
    console.log(type);
    const complain = document.querySelector(".com-problem").value;

    const comObj = { 'name': name, 'email': email, 'enroll': enroll, 'type': type, 'complain': complain };

    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/user/complain',
        data: comObj
    }).then((res) => {
        console.log(res);
        document.querySelector(".com-name").value = "";
        document.querySelector(".com-email").value = "";
        document.querySelector(".com-enroll").value = "";
        document.querySelector("#submitComplaint_type").value = "Choose Complaint Type";
        document.querySelector(".com-problem").value = "";
    })
}