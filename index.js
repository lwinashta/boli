const jq=require('jquery');
const http = require('http');
const url=require('url');
const fs=require('fs');
const path = require('path');

const express = require('express');
const app = express();
const port=8080;

app.use('/resources',express.static('resources'));
app.use('/node_modules',express.static('node_modules'));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/partials/index.html')); 
});

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname+'/partials/login.html')); 
});

app.listen(port,()=>console.log(`listening on port ${port}!`));