let form = document.getElementById('signup-form');
form.onsubmit = (e) => {
    e.preventDefault();

    let data = $(form).serialize();

    //check required fields 
    let check=window.runtime.checkRequiredFields(form);
    
    if (check.length === 0) {
        $.ajax({
            "url": "/signup/new",
            "type": "POST",
            "data": data,
            "async": true,
            "success": function (f) {
                window.location.assign('/signup-complete');

            },
            "error":function(xhr,state,err){
                if(xhr.status===403 && xhr.responseText==="duplicate user"){
                    $(form).find('input[type="email"][name="emailid"]')
                        .closest('.form-group')
                        .append('<div class="req-err-msg">User with entered email address already exists</div>');
                }
            }
        }); 
    }


};