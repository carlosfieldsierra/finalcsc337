/*
Author: Carlos Field-Sierra & Tony Reyes
Description: This is the server for the dynamic portifilo 
    website. This sends back the information to be stored in the
    website such as the portifilo items, the skills. It also has 
    admin login, where admins can add and delete data dyanimcially onto
    the website. Futhemore, it aslo displays messages which have
    been sent via the website to that users portifilio websiste.
*/

// Imports
const crypto = require("crypto")
const express = require("express")
const mongoose = require("mongoose");
const parser = require("body-parser");
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');

// --------------------------
// Multer Photos
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  var upload = multer({ storage: storage })


// MongoDB
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/portolio';
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;

var UserSchema = new Schema({
    username: String,
    salt:String,
    hash:String,
}) 
var PortfolioSchema = new Schema({
    title:String,
    img:String,
    desc:String,
    link:String,
});

var SkillsSchema = new Schema({
    type: String,
    skills:[String],
}) 

var MessageSchema = new Schema({
    name:String,
    email:String,
    message:String,
})

var User = mongoose.model('User', UserSchema );
var Portfolio = mongoose.model('Portfolio', PortfolioSchema );
var Skills = mongoose.model('Skills', SkillsSchema );
var Message = mongoose.model('Message', MessageSchema );

// Set up mongoose connection
mongoose.connect(mongoDBURL,{useNewUrlParser:true});
db.on('error',console.error.bind(console,"MongoDB connection error"));


// Express
const app = express();
app.use(parser.json() );
app.use(parser.urlencoded({ extended: true }));
const port = 3000;
// app.use(cookieParser());
app.use('/', express.static('public_html'));


// Sessions
var sessionKeys = {};


// Gets message from website and stores it in  mongodb server
app.post('/add/message/', (req, res) => {
    const data =  JSON.parse(req.body.data);
    var msg =  new Message({
        name:data.name,
        email:data.email,
        message:data.message,
    })
    msg.save(function (err){
        if (err){
            console.log("error")
        } 
    })
});

// Adds skill to server
app.get("/add/skill/:TYPE/:SKILL",(req,res)=>{
    const TYPE = req.params.TYPE;
    const SKILL = req.params.SKILL;
    Skills.find({type:TYPE}).exec(function(error,results){
        if (results.length>0){
            const skillLst = results[0].skills;
            // Stop duplicates
            if (!skillLst.includes(SKILL)){
                Skills.update(
                    {type:TYPE},
                    {$push:{
                        skills:SKILL
                    }
                }).exec();
            }
        } else {
            var skill =  new Skills({
                type: TYPE,
                skills:[SKILL],
            })
            skill.save(function (err){
                if (err){
                    console.log("error")
                } 
            })
            
        }
    })

   
    res.send("Good");

})

// Sends all the skills to the server
app.get("/get/skills/",(req,res)=>{
    Skills.find({
    }).exec(function(error,results){
        res.send(JSON.stringify(results, null, 10));
    })
});

// Login with a user
app.get("/login/:USERNAME/:PASSWORD",(req,res)=>{
    const USERNAME = req.params.USERNAME;
    const PASSWORD = req.params.PASSWORD;
    User.find({username:USERNAME}).exec(function(error,results){
        if (results.length>0){
            results=results[0];
            // var salt = crypto.randomBytes(64).toString('base64');
            var iterations = 1000;
            crypto.pbkdf2(PASSWORD,results.salt,iterations,64,'sha512', (err,hash)=>{
                if (hash.toString("base64")===results.hash ){
                    res.send("VALID")
                } else {
                    res.send("INVALID")
                }
            })
        } else {
            res.send("INVALID")
        }
    })

})


// add an admin user
app.get("/add/user/:CODE/:USERNAME/:PASSWORD",(req,res)=>{
    const CODE = req.params.CODE;
    const USERNAME = req.params.USERNAME;
    const PASSWORD = req.params.PASSWORD;
    if (CODE==="pass"){
        User.find({username:USERNAME}).exec(
            function(error,results){
                if (results.length>0){
                    return;
                }
                var salt = crypto.randomBytes(64).toString('base64');
                var iterations = 1000;
                crypto.pbkdf2(PASSWORD,salt,iterations,64,'sha512',(err,hash)=>{
                    if (err) console.log(err);
                    var user = new User({
                        username: USERNAME,
                        salt:salt,
                        hash:hash.toString("base64"),
    
                    })
                    user.save(function (err){
                        if (err){
                            console.log("error")
                        } 
                    })
                    res.send("ACCOUNT ADDED")
                    return;
                })
            }
        )
    } else {
        res.send("PASSWORD WRONG")

    }
            

})

// upload image
app.post('/upload', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
 var encode_image = img.toString('base64');
 // Define a JSONobject for the image attributes for saving to database
 
 var finalImg = {
      contentType: req.file.mimetype,
      image:  new Buffer(encode_image, 'base64')
   };
db.collection('quotes').insertOne(finalImg, (err, result) => {
  	console.log(result)

    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  
    
  })
})

app.get('/photos', (req, res) => {
    
})
// Get Photos
app.get("/get/portfolio/",(req,res)=>{
    Portfolio.find({
    }).exec(function(error,results){
        res.send(JSON.stringify(results, null, 10));
    })
})

// Get messages
app.get("/get/messages/",(req,res)=>{
    Message.find({
    }).exec(function(error,results){
        res.send(JSON.stringify(results, null, 10));
    })
})
// Remove from portfolio
app.post("/remove/portfolio",(req,res)=>{
    const data =  JSON.parse(req.body.data);
    Portfolio.find({ title:data.title }).remove().exec()

});

// Removes the skill from a type of skill that contains
app.post("/remove/type/skill",(req,res)=>{
    const data =  JSON.parse(req.body.data);
    console.log(data);
    Skills.findOneAndUpdate(
        { _id: data.id },
        { $pull: { "skills":data.skill } },
        { new: true }
      )
        .then(templates => console.log(templates))
        .catch(err => console.log(err));
})

// This removes a type of skill and all its sub skill
app.post("/remove/type/",(req,res)=>{
    const data =  JSON.parse(req.body.data);
    Skills.find({ type:data.type }).remove().exec()
})

//  This adds an portfolio item to the database/website
app.post("/add/portfolio/",(req,res)=>{
    const data =  JSON.parse(req.body.data);
    var newPortfolio = new Portfolio({
        title:data.title,
        img:"File",
        desc:data.desc,
        link:data.link,
    })
    newPortfolio.save(function (err){});

})


// --------------------------
// Listen for port
app.listen(port,()=>
console.log(`Example app listening at http://localhost:${port}`)
)