let form=document.getElementById('login-form');
form.onsubmit = (e) => {
    e.preventDefault();

    let data=$(form).serialize();

    //check required fields 
    let check = window.runtime.checkRequiredFields(form);
    if (check.length === 0) {
        $.ajax({
            "url": "/login/authenticate",
            "type": "POST",
            "data": data,
            "async": true,
            "success": function (f) {
                console.log(f);
                if(f==="authorized"){
                    window.location.assign('/profile');
                }
            },
            "error": function (xhr, state, err) {
                console.log(xhr);
                if (xhr.status === 401) {
                    $('#unauth-msg-outer').show();
                }
            }
        });
    }
};