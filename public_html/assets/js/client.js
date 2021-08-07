/*
Author: Carlos Field-Sierra & Tony Reyes
Description: These serves as javascript for the main
    page in the portfolio website. It gets all the information
    to show on the website and futhermore allows the
    the client on the site to send messages to the portofilo
    website admins.
*/

window.onload = () => {
    // Sends message to server
    function sendMessage(){
        const name = $("#nameMsg").val();
        const email = $("#emailMsg").val();
        const message = $("#msgMsg").val();
        var newMessage = {
            name,
            email,
            message,
        }
        newMessage = JSON.stringify(newMessage);
        $.ajax({
            url: '/add/message/',
            data:{data: newMessage},
            method:'POST',
            success: function() {
                console.log("success")
            },
            error: function () {
               console.log("Error occured");
            },
        });
    }
    // Listens for message button press
    function sendMessageListener(){
        var btn = document.getElementById("msgBtn");
        btn.addEventListener("click",sendMessage);
    }

    function updateSkills(){
        $.ajax({
            url: "/get/skills/",
            method:'GET',
            success: function( results) {
                results = JSON.parse(results);
                var skillsHtml = "";
                for (var i in results){
                    const skillObj = results[i];
                    const type  = skillObj.type;
                    const skills = skillObj.skills;
                    if (skills.length===0){
                        skillsHtml+=""
                        continue;
                    }
                    skillsHtml+=`<h3 class="skills__subtitle">${type}</h3>`
                    for (var i in skills){
                        const skill = skills[i];
                        skillsHtml+=`<span class="skills__name">${skill}</span>`
                    }
                }
                $("#skillHolder").html(skillsHtml);
            },
            error: function () {
               console.log("error");
            },
        });

    }

    function updatePortfolio(){
        $.ajax({
            url: "/get/portfolio/",
            method:'GET',
            success: function( results) {
                results = JSON.parse(results);
                var portfolioHtml=""
                for (var i in results){
                    const flexItem = results[i];
                    portfolioHtml+=`
                        <div class="portfolio__img">
                        <img  style="border:2px solid gray" src="assets/img/github.png" alt="">
                        <div class="portfolio__link">
                            <a href="${flexItem.link}" class="portfolio__link-name">Click right on me :)</a>
                        </div>
                        <h1>${flexItem.title}</h1>
                        <p> 
                        ${flexItem.desc}
                        </p>
                        </div> `
                }
                
                    
                $("#portfoliodiv").html(portfolioHtml);
            },
            error: function () {
               console.log("error");
            },
        });
    }
    function Main(){
        sendMessageListener();
        updateSkills();
        updatePortfolio();
    }

    Main();
}