const form = document.querySelector(".login form"); //el form kella
const continueBtn = form.querySelector(".button input");//fa2set el submit
const errorText = form.querySelector(".error-text");

//
//he el function li tahet btemna3 el submit tenbe3et
// e hye khassa hasran bel event handlers w ma bteje ma3 gayra
form.onsubmit = (e) => {
    e.preventDefault();//preventing form from submitting
    //a(); // hala2 hon bi he el 7ala btebtba3 "ma"
}
// function a() {
//     console.log("ma");
// }

continueBtn.onclick = () => {
    //let's start Ajax
    //xhr.open takes many paramaters but we only pass method , url, and async
    // xhr.reponse gives us response of that passed URL
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/login.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let data = xhr.response;
                // console.log(data);
                if (data == "success") {
                    location.href = "users.php";
                } else {
                    errorText.textContent = data;//echo li bel php page
                    errorText.style.display = "block";


                }
            }

        }
    }
    // we have to send the form data through ajax to php
    let formData = new FormData(form);//creating new formData
    xhr.send(formData);//sending to form data to php

}

