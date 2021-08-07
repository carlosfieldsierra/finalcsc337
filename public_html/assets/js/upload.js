
/*
Author: Carlos Field-Sierra & Tony Reyes
Description: This handles all the crud commands
    on the admin login site. CRUD once again
    stands for Create, Remove, Update, Delete.
*/

// Deletes porfifilo item from db
function deleteFromDB(id,title){
    document.getElementById(id).style.visibility = "hidden";
    var idDic = {title}
    idDic = JSON.stringify(idDic);
    $.ajax({
        url: "/remove/portfolio/",
        data:{data: idDic},
        method:'POST',
        success: function() {
        },
        error: function () {
           console.log("Error occured");
        },
    });
}

function deleteFromDbType(id,type){
    document.getElementById(id).style.visibility = "hidden";
    var idDic = {type}
    idDic = JSON.stringify(idDic);
    $.ajax({
        url: "/remove/type/",
        data:{data: idDic},
        method:'POST',
        success: function() {
            
        },
        error: function () {
           console.log("Error occured");
        },
    });
}

function deleteFromDbSkill(id,type,skill){
    var idDic = {id,type,skill}
    idDic = JSON.stringify(idDic);
    document.getElementById(id+skill).style.visibility = "hidden";
    $.ajax({
        url: "/remove/type/skill",
        data:{data: idDic},
        method:'POST',
        success: function() {
        },
        error: function () {
           console.log("Error occured");
        },
    });
}
window.onload = () => {
    // Gets all the portifilo Items and displays them on content
    function getPortifolioItems(){
        $.ajax({
            url: "/get/portfolio/",
            method:'GET',
            success: function( results) {
                var tableDataHtml = "";
                results = JSON.parse(results);
                for (var i in results){
                    const flexItem = results[i];
                    tableDataHtml+=`
                    <tr id="${flexItem._id}">
                        <td>${flexItem.title}</td>
                        <td>${flexItem.desc}</td>
                        <td>${flexItem.link}</td>
                        <th><button onclick='deleteFromDB("${flexItem._id}","${flexItem.title}")'>Delete</button></th>
                    </tr>
                    `
                }
                $("#customers").html(tableDataHtml);
            },
            error: function () {
                console.log("error");
            },
        })

    }

    function addPortifolioItem(){
        const title = $("#title").val();
        const desc = $("#desc").val();
        const link = $("#link").val();
        const photo = $("#imageUpload").val();
        console.log(photo);

        var newPort = {
            title,
            desc,
            link,
        }
        newPort = JSON.stringify(newPort);
        $.ajax({
            url: '/add/portfolio/',
            data:{data: newPort},
            method:'POST',
            success: function() {
                console.log("success")
            },
            error: function () {
               console.log("Error occured");
            },
        });

    }

    function addPortifolioBtnListener(){
        var btn = document.getElementById("addPortfilio");
        btn.addEventListener("click",addPortifolioItem);

    }

    function addSkillItem(){
        const type = $("#skillType").val();
        const skill = $("#skillSkill").val();
        let newSkill = {
            type,
            skill,
        }
        newSkill = JSON.stringify(newSkill);
        $.ajax({
            url: `/add/skill/${type}/${skill}`,
            method:'GET',
            success: function() {
                console.log("success")
            },
            error: function () {
               console.log("Error occured");
            },
        });
        

    }

    function getSkillItems(){
        $.ajax({
            url: "/get/skills/",
            method:'GET',
            success: function( results) {
                var skillDataHtml = "";
                results = JSON.parse(results);
                for (var i in results){
                    const skillItem = results[i]; 
                    const type= skillItem.type;
                    skillDataHtml+=` <div id="${skillItem._id}" class='skillOverall'>
                    <span id="ss_elem">
                   <h3> ${type} </h3>`
                    skillDataHtml+=`
                    <button onclick='deleteFromDbType("${skillItem._id}","${skillItem.type}")' class='deleteBtnTwo'>Delete Type</button>
                    </span>`
                    if (skillItem.skills.length===0){
                        skillDataHtml=""
                        continue
                    }
                    for (var i in skillItem.skills){
                        const skill = skillItem.skills[i];
                        skillDataHtml+=`
                            <span id="${skillItem._id}${skill}">
                                <ul id="ss_elem_list"
                                    tabindex="0"
                                    role="listbox"
                                    aria-labelledby="ss_elem">
                                
                                <li id="ss_elem_Np" role="option">
                                    ${skill}
                                    <button onclick='deleteFromDbSkill("${skillItem._id}","${skillItem.type}","${skill}")' class='deleteBtnTwo'>Delete Skill</button>
                                </li>
                                </span> </br>
                        `
                        
                    }
                    
                    skillDataHtml+="</ul></div>"
                }
                $("#leftDiv").html(skillDataHtml);

            },
            error: function () {
                console.log("error");
            },
        })
    }
    

    function addSkillBtn(){
        var btn = document.getElementById("addSkillBtn");
        btn.addEventListener("click",addSkillItem);
    }

    function getMessages(){
        $.ajax({
            url: "/get/messages/",
            method:'GET',
            success: function( results) {
                results = JSON.parse(results);
                var messageHtml = "";
                for (var i in results){
                    const msgItem = results[results.length-1 -i];
                    messageHtml+=`
                        <div class="container">
                            <span class="nameComent">${msgItem.name}</span>
                            <p>${msgItem.message}</p>
                            <span class="userComent">${msgItem.email}</span>
                        </div>
                    `
                }
                $("#msgHolder").html(messageHtml);
            }
        })
    }

    function logoutBtnHandler(){
        var btn = document.getElementById("logoutBtn");
        btn.addEventListener("click",()=>{
            window.location = "index.html"
        });
    }

    function Main(){
        logoutBtnHandler();
        addPortifolioBtnListener();
        getPortifolioItems();
        setInterval(getPortifolioItems,5000);
        addSkillBtn();
        getSkillItems();
        setInterval(getSkillItems,5000);
        getMessages();
        setInterval(getMessages,5000);
    }
    Main();
}