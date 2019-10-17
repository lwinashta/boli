const jq=require('jquery');
const http = require('http');
const url=require('url');
const fs=require('fs');
const path = require('path');

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

app.get('/',(req,res)=>{
    res.render('pages/index');
    res.end();
});

app.get('/login',(req,res)=>{
    res.render('pages/login');
    //res.sendFile(path.join(__dirname+'/partials/login.html')); 
});

app.post('/login/authenticate',(req,res)=>{
    //res.send(req.fields);
    userManagement.authenticate(req.fields).then(function(data){
        res.send(data);
    }).catch((err)=>{
        res.status(401);
        res.send("unAuthorized");
    });
});

app.get('/signup',(req,res)=>{
    res.render('pages/signup');
});

app.post('/signup/new',(req,res)=>{
    userManagement.signup(req.fields).then(function(data){
        res.send(data);
    }).catch((err)=>{
        res.status(500);
        res.send(err);
    });
});

app.listen(port,()=>console.log(`listening on port ${port}!`));