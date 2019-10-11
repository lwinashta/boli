$('document').ready(function () {
    BindLoginButton();
    BindSignupButton();
    
    $('.letter-audio').hover(function(){
        PlaySound(this);
    });
    
});

//-- bind login button -- 
function BindLoginButton() {
    $('.login-button').unbind('click');
    $('.login-button').click(function () {
        $('.modal').find('button[data-dismiss="modal"]').trigger('click');
        $.get('/Content/Language/_modal/login.html').done(function (h) {
            $('body').append(h);
            $('#LoginToModal').modal();
            BindSignupButton();
            $('#LoginToModal').on('hidden.bs.modal', function () {
                $('#LoginToModal').remove();
            });
        });
    });
}

//-- bind sign up button -- 
function BindSignupButton(){
    $('.signup-button').unbind('click');
    $('.signup-button').click(function(){
        $('.modal').find('button[data-dismiss="modal"]').trigger('click');
        $.get('/Content/Language/_modal/signup.html').done(function(h){
            $('body').append(h);
            $('#SignUpModal').modal();
            BindLoginButton();
            $('#SignUpModal').on('hidden.bs.modal',function(){
                $('#SignUpModal').remove();
            });
        });
    });
}

function PlaySound(el){
    $(el).find('audio').trigger('play');
}