
const db=require('./connect');
const crypto=require('crypto');
const userManagement={};

(function(){

    this.sysDb=new db();
    this.connect=this.sysDb.connect();

    this.authenticate=function(username,passw){
        return new Promise((resolve,reject)=>{
            let self=this;
            this.connect.then(function(data){
                //authenticate user
                return self.sysDb.exec();
    
            }).then(function(data){
                resolve(data);
    
            }).catch(function(err){
                console.log(err);
                reject(err);
            });
        });
    };

    this.signup=function(values){

        return new Promise((resolve,reject)=>{
            
            let self=this;
            let cryptoObject=crypto.createCipher('aes-128-cbc', values.password);
            let passw=cryptoObject.update(values.password, 'utf8', 'hex');
            passw+=cryptoObject.final('hex');

            this.connect.then(function(data){
                //authenticate user
                return self.checkUserExist(values);
                
            }).then(function(data){
                return self.sysDb.getLastId("system.user");
                
            }).then(function(data){
                let userid=data.results[0].id;
                let query=`Insert into 
                    system.user(firstname, lastname, emailid,userid,password) 
                    values ('${values.firstname}','${values.lastname}',
                        '${values.emailid}','${userid}','${passw}')`;

                return self.sysDb.exec(query);

            }).then(function(data){
                resolve(data);
    
            }).catch(function(err){
                console.log(err);
                reject(err);
            });
        });
    };

    this.checkUserExist=function(values){
        return new Promise((resolve,reject)=>{

            let self=this;

            this.connect.then(function(data){
                let query=`Select emailid from system.user where emailid='${values.emailid}'`;
                return self.sysDb.exec(query);
                
            }).then(function(data){
                if(data.results.length>0){
                    //user exists 
                    reject("duplicate user");

                }else if(data.results.length===0){
                    resolve(data);
                }
    
            }).catch(function(err){
                console.log(err);
                reject(err);
            });
        });
    };

}).apply(userManagement);

module.exports=userManagement;
