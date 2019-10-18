var languages=[];
var configSettings={
    "language":{
        "iKnow":[],
        "wantToLearn":[]
    }
};

$('.config-step-content[step="1"]').show(100);

$.getJSON('/meta/languages.json').done(function(d){
    let html='';
    languages=d;
    languages.forEach(element => {
        html+=`<div language="${element.language}" 
                class="inline languages-col pad-10 bor-sm-grey bor-sm-ro">
            <div class="language-icon">
                <img src="${element.icon}">
            </div>
            <div class="langauge-name text-center"><b>${element.language}</b></div>
        </div>`;
    });
    $('#i-speak-languages-container').html(html);
});

$('#i-speak-languages-container').on('click','.languages-col',function(){
    //reset the language to learn container 
    let html="";

    $('#i-speak-languages-container').find('.languages-col').find('.selected-icon').remove();

    let toLearn=languages.filter(l=>l.language===$(this).attr('language'))[0].learn;
    
    $(this).append(`<div class="selected-icon">
        <i class="fas fa-check"></i>
    </div>`);

    toLearn.forEach(function(d){
        let l= languages.filter(l=>l.language===d)[0];
        html+=`<div language="${l.language}"  
                class="inline languages-col pad-10 bor-sm-grey bor-sm-ro">
            <div class="language-icon">
                <img src="${l.icon}">
            </div>
            <div class="langauge-name text-center"><b>${l.language}</b></div>
        </div>`;
    }); 
    $('#i-want-learn-language-container').html(html);
    $('#i-want-learn-outer-container').fadeIn();

    //hide next button 
    $(this)
        .closest('.config-step-content')
        .find('.user-config-next-step-button').hide();
});

$('#i-want-learn-language-container').on('click','.languages-col',function(){
    //reset the language to learn container 
    $('#i-want-learn-language-container')
        .find('.languages-col').find('.selected-icon').remove();
    
    $(this).append(`<div class="selected-icon">
        <i class="fas fa-check"></i>
    </div>`);

    //show next button 
    $(this)
        .closest('.config-step-content')
        .find('.user-config-next-step-button').show();
});

$('#app-body').on('click','.user-config-next-step-button',function(){
    //get the step number 
    let parentContainer=$(this).closest('.config-step-content');
    let stepNum=parseInt($(parentContainer).attr('step'));
    let nextStepSection=$('.config-step-content[step="'+(stepNum+1)+'"]');

    switch(stepNum){
        case 1:
            //execute step method
            $(parentContainer)
                .find('#i-speak-languages-container')
                .find('.languages-col')
                .find('.selected-icon').each(function(){
                    configSettings.language.iKnow.push($(this).closest('.languages-col').attr('language'));
                });
            
            let langaugesToLearn=[];
                
            $(parentContainer)
                .find('#i-want-learn-language-container')
                .find('.languages-col')
                .find('.selected-icon').each(function(){
                    langaugesToLearn.push($(this)
                        .closest('.languages-col').attr('language'));
                });

            configSettings.language.wantToLearn.push(langaugesToLearn);
            $(parentContainer).hide();
            $(nextStepSection).show();

            $(nextStepSection)
                .find('#selected-want-to-learn-language')
                .html(langaugesToLearn.join(','))

            break;

    }
    console.log(configSettings);
});