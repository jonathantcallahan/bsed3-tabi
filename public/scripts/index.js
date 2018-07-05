const log = console.log;

$( document ).ready(function(){
    $('a.jump').click(function(){
        event.preventDefault();
        const hash = this.hash;
        log(hash);
        $('html, body').animate({
            scrollTop: $(`${hash}`).offset().top
        }, 800)
    })
})