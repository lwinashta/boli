
const db = require('./connect');
const crypto = require('crypto');
const fs=require('fs');
const util=require('util');

const writeFile=util.promisify(fs.writeFile);

const userManagement = {};

(function () {

    this.sysDb = new db();
    this.connect = this.sysDb.connect();
    this.userfields=`createdby,creationdatestamp,emailid,firstname, lastname, pk,profileid`;

    this.authenticate = function (values) {
        return new Promise((resolve, reject) => {
            let self = this;
            this.connect.then(function (data) {
                //authenticate user
                let passw=self.generateCryptoPasswString(values.password);
                let query=`Select ${self.userfields}  
                    from system.user where emailid='${values.emailid}' 
                    AND password='${passw}'`;

                return self.sysDb.exec(query);

            }).then(function (data) {
                if (data.results.length>0){
                    resolve(data);
                }else{
                    reject("Unauthorize");
                }
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    };

    this.generateCryptoPasswString = function (password) {
        let cryptoObject = crypto.createCipher('aes-128-cbc', password);
        let passw = cryptoObject.update(password, 'utf8', 'hex');
        passw += cryptoObject.final('hex');
        return passw;
    };

    this.getNewProfileId=function(results){
        let randomNum=Math.floor(Math.random() * Math.floor(16779));
        let profileId=`U${Date.now()}${randomNum}`;
        if(results.length===0){
            //data.results[0].id
            profileId+='1';
        }else{
            profileId+=results[0].id+1;
        }
        return profileId;
    };

    this.signup = function (values) {
        let userInfo={};
        return new Promise((resolve, reject) => {

            let self = this;
            let passw=self.generateCryptoPasswString(values.password);

            this.connect.then(function (d1) {
                //authenticate user
                return self.checkUserExist(values);

            }).then(function (d2) {
                return self.sysDb.getLastId("system.user");

            }).then(function (d3) {
                let profileid = self.getNewProfileId(d3.results);
                
                let query = `Insert into 
                    system.user
                    (firstname, lastname, 
                        emailid,profileid,password,
                        createdby) 
                    values ('${values.firstname}','${values.lastname}',
                        '${values.emailid}','${profileid}','${passw}',
                        'user-sign-page')`;

                return self.sysDb.exec(query);

            }).then(function (d4) {
                //console.log(d4);
                return self.getUserInfo(`pk='${d4.results.insertId}'`);
                
            }).then(function(d5){
                userInfo=d5;
                
                //create the file for the user config
                let filePath=`./data/${d5.results[0].profileid}.json`;
                return self.createConfigFile(filePath,JSON.stringify({userInfo:userInfo.results[0]}));

            }).then(function(d6){
                console.log("file created");
                resolve(userInfo);

            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    };

    this.checkUserExist = function (values) {
        return new Promise((resolve, reject) => {

            let self = this;

            this.connect.then(function (data) {
                let query = `Select emailid from system.user where emailid='${values.emailid}'`;
                return self.sysDb.exec(query);

            }).then(function (data) {

                if (data.results.length > 0) {
                    //user exists 
                    reject("duplicate user");

                } else if (data.results.length === 0) {
                    resolve(data);
                }

            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    };

    this.getUserInfo=function(q){
        return new Promise((resolve, reject)=>{
            let self = this;
            this.connect.then(function (data) {
                //get user
                let query=`Select ${self.userfields}  
                    from system.user where ${q}`;
                //console.log(query);
                return self.sysDb.exec(query);

            }).then(function (data) {
                if (data.results.length>0){
                    resolve(data);
                }else{
                    reject("not-logged");
                }
            }).catch(function (err) {
                console.error(err);
                reject(err);
            });
        });
    }

    this.createConfigFile=(filePath,data)=>{
        return writeFile(filePath,data);
    };

}).apply(userManagement);

module.exports = userManagement;
