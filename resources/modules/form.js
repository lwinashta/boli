const jq=require('jquery');

class form{
    constructor(values){
        this.form={};
        this.afterSubmit=function(){};
        this.beforeSubmit=function(){};
        Object.assign(this,values);
    }
    async checkRequired(){
        let self=this;
        console.log(jq(this.form));
        //jq(this.form).find('input,select,textarea').attr('data-required')
    }
    submit(){
        let data=new FormData(this.form);
        console.log(data);
        this.checkRequired();
    }
}

module.exports = form;