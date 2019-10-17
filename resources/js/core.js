window.runtime = {
    checkRequiredFields: function (form) {
        let allControls = $(form).find('input[data-required="1"]', 'select[data-required="1"],textarea[data-required="1"]');
        $(form).find('.req-err-msg').remove();
        let error = [];
        $(allControls).each(function () {
            if ($(this).val().length === 0) {
                $(this).closest('.form-group').append('<div class="req-err-msg">Required</div>');
                error.push($(this).attr('name'));

            }else if($(this).val().length> 0 && $(this).attr('type')==="password"){
                //check password criteria
                if($(this).val().length<8){
                    $(this).closest('.form-group').append('<div class="req-err-msg">Password does not match the criteria</div>');
                    error.push($(this).attr('name'));
                }
            }
        });

        return error;
    }
}