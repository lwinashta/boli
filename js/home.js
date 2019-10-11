var display_words=[
    {
        burmese_english:'Min Ga La Ba',
        burmese:'အသောကာရ',
        english:'Hello'
    },
    {
        burmese_english:'Nei Kaon La',
        burmese:'အသောကာရ',
        english:'How are you?'
    },
    {
        burmese_english:'Kyei Zuu Tin Ba De',
        burmese:'အသောကာရ',
        english:'Thank you'
    },
    {
        burmese_english:'Kyaoso Bar Ei',
        burmese:'အသောကာရ',
        english:'Welcome'
    }
];

$('document').ready(function () {
    var currentcounter = 1;
    
    var insertvalues=function(){
        $('#ScrollingWordsContainer #burmese_english').html(display_words[currentcounter].burmese_english);
        $('#ScrollingWordsContainer #burmese').html(display_words[currentcounter].burmese);
        $('#ScrollingWordsContainer #english').html(display_words[currentcounter].english);
        currentcounter++;
        if (currentcounter > display_words.length - 1) {
            currentcounter = 0;
        }
    };
    
    var show=function(){
        $("#ScrollingWordsContainer").animate({
            opacity: 1
        }, 3000,function(){
            hide();
        });
    };
    
    var hide=function(){
        $("#ScrollingWordsContainer").animate({
            opacity: 0
        }, 2000,function(){
            insertvalues();
            show();
        });
    };
    
    hide();
    

});
