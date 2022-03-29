const form = document.querySelector(".typing-area");//hye el form
const inputField = form.querySelector(".input-field");// input
const sendBtn = form.querySelector("button");
const chatBox = document.querySelector(".chat-box");


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
                inputField.value = "";//once message is inserted into database then leave blamk the input value
                scrollBottom();
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

chatBox.onmouseenter = () => {
    chatBox.classList.add("active");
}
chatBox.onmouseleave = () => {
    chatBox.classList.remove("active");
}

setInterval(() => {
    //lets start Ajax
    let xhr = new XMLHttpRequest();//creating xml object
    xhr.open("POST", "php/get-chat.php", true);//btruh btjib el ma3lumet mena
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let data = xhr.response;//btred jaweb
                chatBox.innerHTML = data;
                if (!chatBox.classList.contains("active")) {//if active class not contains in chatbox the scroll to bottom
                    scrollBottom();
                }
            }

        }
    }
    //we have to send the form data through ajax to php
    let formData = new FormData(form);//creating new formDATa Object
    xhr.send(formData);//sending the form data to php
}, 500);//this function will run frequenlty after 500m



function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}