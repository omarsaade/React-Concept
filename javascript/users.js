const searchBar = document.querySelector(".users .search input");//input
const searchBtn = document.querySelector(".users .search button");//button


searchBtn.onclick = () => {
    searchBar.classList.toggle("active");//marra hik marra hik
    searchBar.focus();
    searchBtn.classList.toggle("active");
}