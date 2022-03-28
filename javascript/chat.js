const form = document.querySelector(".typing-area");
const sendBtn = form.querySelector("button");
const inputField = form.querySelector(".input-field");


form.onsubmit = (e) => {
    e.preventDefault();//preventing form from submitting
}
//
sendBtn.onclick = () => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/insert-chat.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                inputField.value = "";
                // let data = xhr.response;
                // console.log(data);
                // if (data == "success") {
                //     location.href = "users.php";
                // } else {
                //     errorText.textContent = data;
                //     errorText.style.display = "block";
                // }
            }
        }
    }
    let formData = new FormData(form);
    xhr.send(formData);
}