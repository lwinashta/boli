let form=document.getElementById('login-form');
form.onsubmit = (e) => {
    e.preventDefault();

    let data=$(form).serialize();
  
    $.ajax({
        "url":"/login/authenticate",
        "type":"POST",
        "data":data,
        "async":true,
        "success":function(f){
            console.log(f);
        }
    });

};