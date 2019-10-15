const mysql=require('mysql');
class mysqlDb{
    constructor(){
        this.host="boli-dev-3.cy8avxr9w1dt.us-west-2.rds.amazonaws.com";
        this.username="admin";
        this.passw="masteradmin";
        this.con={};
        this.port=33060;
    }

    connect() {
        let self = this;
        this.con = mysql.createConnection({
            host: self.host,
            user: self.username,
            password: self.passw,
            port:self.port
        });

        this.con.connect(function(err){
            if (err) throw err;
            console.log("Connected!"); 
        });
    }

}
module.exports = mysqlDb;