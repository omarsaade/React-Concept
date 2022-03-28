const searchBar = document.querySelector(".users .search input");//input
const searchBtn = document.querySelector(".users .search button");//button
const usersList = document.querySelector(".users .users-list");//ma7al malah yenzalo el friends


searchBtn.onclick = () => {
    searchBar.classList.toggle("active");//marra hik marra hik 
    searchBar.focus();
    searchBtn.classList.toggle("active");
    searchBar.value = "";
}





searchBar.onkeyup = () => {
    let searchTerm = searchBar.value;//create hay li fia value
    if (searchTerm != "") {
        searchBar.classList.add("active");
    } else {
        searchBar.classList.remove("active");

    }
    //let's start Ajax
    let xhr = new XMLHttpRequest();//creating xml object
    // https://www.w3schools.com/xml/ajax_xmlhttprequest_send.asp


    //method: the type of request: GET or POST
    // send()	Sends the request to the server(used for GET)
    // send(string)	Sends the request to the server (used for POST)
    // method: the type of request: GET or POST
    // url: the server (file) location
    // async: true (asynchronous) or false (synchronous)
    xhr.open("POST", "php/search.php", true);//btruh btjib el ma3lumet mena
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {//el server t3amal ma3 el request bi najeh
                let data = xhr.response;//response huwe jaweb li bi redo elserver
                // console.log(data);
                usersList.innerHTML = data;


            }

        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("searchTerm=" + searchTerm);//sending user search term to php file with ajax
    // searchTerm=omar
    // a = +a is equivalent to a = a
    //'a=2'
    // console.log("searchTerm=" + searchTerm);
}
//sending the request to the server
// To POST data like an HTML form, add an HTTP header with setRequestHeader()
// . Specify the data 
// you want to send in the send() method:






setInterval(() => {
    //lets start Ajax
    let xhr = new XMLHttpRequest();//creating xml object
    xhr.open("GET", "php/users.php", true);//btruh btjib el ma3lumet mena
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let data = xhr.response;//btred jaweb
                // console.log(data);
                // usersList.innerHTML = data;
                if (!searchBar.classList.contains("active")) { //if active not contains in search bar then add this data
                    usersList.innerHTML = data;

                }
            }

        }
    }
    xhr.send();//IRSEL EL REQUEST


}, 500);//this function will run frequenlty after 500ms



//in the same file here , ajax is running two times.One for users list
//  and another one is when we search the user.so it override and now i will stop users list
//      ajax when user is about searching