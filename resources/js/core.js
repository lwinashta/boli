
$.fn.hideOffFocus = function () {
    //hide the container on out of focus
    var container = this;

    $(document).mouseup(function (e) {
        if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            $(container).find('.hide-this-container').hide(200);
        }
    });
};

$('document').ready(function(){
    $('body').find('.hide-off-focus-container').hideOffFocus();
    $('#header-user-info').click(function(e){
        $(this).find('#header-user-details').show();
    });
});

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