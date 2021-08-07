/*
Author: Carlos Field-Sierra & Tony Reyes
Description: These serves as javascript for the admin
    login page. It takes care of login in to the admin
    page in which the admin can add and delete stuff
    onto the portifolio website.
*/

window.onload = () => {
    // These sends a get request to the server
    // with the username and password using hashing 
    // and slating to be secure.
    function signIn(){
        const username = $("#username").val();
        const password = $("#password").val();
        console.log(username);
        $.ajax({
            url:`/login/${username}/${password}`,
            method:'GET',
            success: function(results) {
                console.log(results);
                if (results==="VALID"){
                    // <-- GO TO ADMIN -->
                    window.location = "content.html"
                }
            },
            error: function (err) {
            },
            
        })
    }

    // Listens for click actions on the login buttom
    // and then fires signIn function as a callback
    function signInBtnListenr(){
        var btn = document.getElementById("loginBtn");
        btn.addEventListener("click",signIn);
    }


    function Main(){
        signInBtnListenr();
    }
    Main();
}