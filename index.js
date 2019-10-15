const jq=require('jquery');
const http = require('http');
const url=require('url');
const fs=require('fs');
const path = require('path');

//const parser=require('body-parser');
const formidable = require('express-formidable');
const express = require('express');

const form=require('./resources/modules/form');
const db=require('./resources/modules/connect');

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
    //console.log(req);
    let c=new db();
    c.connect();
    res.send(req.fields);
    console.log("validation triggerred");
});

app.listen(port,()=>console.log(`listening on port ${port}!`));