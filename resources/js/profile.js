let getUserProfileId=$('#app-body').attr('user');//set the variable with th user id

//--check and create user config file 
//check if user config file exists 
//if exists and if it has the values for the userconfig render profile page
//if the file doesnt exists - render user-config.ejs
//if the file exiss but user config doesnt exists - render user-config.ejs
$.getJSON(`/data/${getUserProfileId}.json`).done(function(d){
    console.log(d);
    //check user config exists 
    if(!("userConfig" in d)){
        window.location.assign('/user/user-config');
    }else{
        //do nothing stay on profile page
    }
}).fail(function(err){
    if(err.status===404){
        //create the new user file
        $.post('/user/create/user-config-file',{"profileid":getUserProfileId}).done((filepath)=>{
            window.location.assign('/user/user-config');
        }).fail(function(){
            console.error("issue with file creation");
        });
    }
});