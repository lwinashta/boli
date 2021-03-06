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

const app = express();
const port=8080;

app.set('view engine', 'ejs');

app.use('/resources',express.static('resources'));
app.use('/node_modules',express.static('node_modules'));
app.use('/meta',express.static('meta'));
app.use('/data',express.static('data'));

app.use(formidable());
app.use(cookie());

//app.use(express.urlencoded({extended:true}));
//app.use(express.json());

//check user info for each page
app.use(function(req, res, next){

    this.notLogged=function(){
        app.locals.userinfo={}; 
        next(); 
    };

    //check if cookie exists 
    if("userProfileId" in req.cookies && req.cookies.userProfileId.length>0){
        let q=`profileid='${req.cookies.userProfileId}'`;
        userManagement.getUserInfo(q).then(function(data){
            let userinfo=data.results[0];
            app.locals.userinfo=userinfo;
            next();
        }).catch(function(err){
            notLogged();
        });
    }else{
        notLogged();
    }
});

app.use('/user',function(req, res, next){
    //check if cookie exists 
    if("userProfileId" in req.cookies && req.cookies.userProfileId.length>0){
        let q=`profileid='${req.cookies.userProfileId}'`;
        userManagement.getUserInfo(q).then(function(data){
            let userinfo=data.results[0];
            app.locals.userinfo=userinfo;
            next();
        }).catch(function(err){
            //if user no logged - redirect to login page
            res.redirect('/login');
        });
    }else{
        //if user no logged - redirect to login page
        res.redirect('/login');
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
        res.redirect('/user/profile');
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

app.get('/user/profile',(req,res)=>{
    res.render('pages/profile');
});

app.get('/user/user-config',(req,res)=>{
    //check if language selection is done 
    res.render('pages/user-config');
});

app.get('/user/sign-out',(req,res)=>{
    res.clearCookie("userProfileId");
    res.redirect('/login');
});

app.post("/user/create/user-config-file",(req,res)=>{
    //create new file with user info
    let filePath=`./data/${req.fields.profileid}.json`; 
    userManagement.createConfigFile(filePath,JSON.stringify({userInfo:app.locals.userinfo}))
    .then(function(d){
        res.send("file created");
    })
    .catch(function(err){
        console.log(err);
        res.status(404);
        res.send("Error in creating file");
    });
});

app.listen(port,()=>console.log(`listening on port ${port}!`));