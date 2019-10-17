const mysql=require('mysql');
class mysqlDb{
    constructor(){
        this.host="boli-dev-3.cy8avxr9w1dt.us-west-2.rds.amazonaws.com";
        this.username="admin";
        this.passw="masteradmin";
        this.port=33060;
        let self=this;
        this.con=mysql.createConnection({
            host: self.host,
            user: self.username,
            password: self.passw,
            port:self.port
        });
        
    }

    connect() {
        let self = this;
        let connection = new Promise(function(resolve,reject){
            try{
                self.con.connect();
                resolve("connected");
            }catch(err){
                reject('access denied');
            }
        });

        return connection;
    }

    exec(query){
        let self=this;
        return new Promise((resolve,reject)=>{
            try{
                this.con.query(query,(error, results, fields)=>{
                    if(error) throw error;
                    resolve({
                        results:results,
                        fields:fields
                    });
                });
            }catch(err){
                reject(err);
            }
            
        });        
    }

    getLastId(db){
        let self=this;
        return new Promise((resolve,reject)=>{
            self.exec(`Select MAX(pk) as id from ${db}`)
            .then((results)=>{
                resolve(results);
            }).catch((err)=>{
                reject(err);
            })
        });
    }

    end(){
        this.con.end(function(err){
            if (err) throw err;
            console.log("Connection ended!"); 
        });
    }

}
module.exports = mysqlDb;