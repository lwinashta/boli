
const db = require('./connect');
const crypto = require('crypto');
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

        return new Promise((resolve, reject) => {

            let self = this;
            let passw=self.generateCryptoPasswString(values.password);

            this.connect.then(function (data) {
                //authenticate user
                return self.checkUserExist(values);

            }).then(function (data) {
                return self.sysDb.getLastId("system.user");

            }).then(function (data) {
                let profileid = self.getNewProfileId(data.results);
                
                let query = `Insert into 
                    system.user
                    (firstname, lastname, 
                        emailid,profileid,password,
                        createdby) 
                    values ('${values.firstname}','${values.lastname}',
                        '${values.emailid}','${profileid}','${passw}',
                        'user-sign-page')`;

                return self.sysDb.exec(query);

            }).then(function (data) {
                resolve(data);

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

    this.getUserByprofileId=function(profileid){
        return new Promise((resolve, reject)=>{
            let self = this;
            this.connect.then(function (data) {
                //get user
                let query=`Select ${self.userfields}  
                    from system.user where profileid='${profileid}'`;

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

}).apply(userManagement);

module.exports = userManagement;
