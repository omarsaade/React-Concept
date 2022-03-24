const pswrdField = document.querySelector(".form input[type='password']");
const toggleBtn = document.querySelector(".form .field i");

//show hide password / eyes ..font awesome website
toggleBtn.onclick = () => {

    if (pswrdField.type == "password") {
        pswrdField.type = "text";
        toggleBtn.classList.add("active");
        // eye-slash https://fontawesome.com/icons/eye-slash?s=regular
    } else {
        pswrdField.type = "password";
        toggleBtn.classList.remove("active");
    }
}