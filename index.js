const jq=require('jquery');
const http = require('http');
const url=require('url');
const fs=require('fs');
const path = require('path');
const cookie=require('cookie-parser');

//const parser=require('body-parser');
const formidable = require('express-formidable');
const express = require('express');

const userManagement=require('./resources/modules/user.mgmt')
const form=require('./resources/modules/form');

const app = express();
const port=8080;

app.set('view engine', 'ejs');

app.use('/resources',express.static('resources'));
app.use('/node_modules',express.static('node_modules'));
//app.use(express.urlencoded({extended:true}));
//app.use(express.json());
app.use(formidable());
app.use(cookie());

//check user info for each page
app.use(function(req, res, next){

    this.notLogged=function(){
        app.locals.userinfo={}; 
        next(); 
    };

    //check if cookie exists 
    if("userProfileId" in req.cookies && req.cookies.userProfileId.length>0){
        userManagement.getUserByprofileId(req.cookies.userProfileId).then(function(data){
            let userinfo=data.results[0];
            //console.log(userinfo);
            app.locals.userinfo=userinfo;
            next();
        }).catch(function(err){
            notLogged();
        });
    }else{
        notLogged();
    }
});

app.get('/',(req,res)=>{
    res.render('pages/index');
    res.end();
});

app.get('/login',(req,res)=>{
    if(!("userProfileId" in req.cookies)){
        res.render('pages/login');
    }else{
        res.redirect('/profile');
    }
    //res.sendFile(path.join(__dirname+'/partials/login.html')); 
});

app.post('/login/authenticate',(req,res)=>{
    //res.send(req.fields);
    userManagement.authenticate(req.fields).then(function(data){
        let profileid=data.results[0].profileid;
        res.cookie("userProfileId",profileid,{"maxAge":360000});
        res.send('authorized');
    }).catch((err)=>{
        res.status(401);
        res.send("unauthorized");
    });
});

app.get('/signup',(req,res)=>{
    res.render('pages/signup');
});

app.post('/signup/new',(req,res)=>{
    userManagement.signup(req.fields).then(function(data){
        console.log(data);
        res.send(data);
        
    }).catch((err)=>{
        if(err==="duplicate user"){
            res.status(403);
        }
        res.send(err);
    });
});

app.get('/signup-complete',(req,res)=>{
    res.render('pages/signup-complete');
});

app.get('/profile',(req,res)=>{
    //get user info from the profile id and then pass that info to the page
    //if userprofileid doesnt exists in the cookie - go to login page 
    if(!("userProfileId" in req.cookies)){
        res.status(401);
        res.redirect('/login');
    }else{
        res.render('pages/profile');
    }
});

app.listen(port,()=>console.log(`listening on port ${port}!`));