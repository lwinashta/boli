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
                console.log(f);
            }
        });
    }


};