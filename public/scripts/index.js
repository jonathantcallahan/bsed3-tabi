$( document ).ready(function(){
    
    const log = console.log;

    const scroll = hash => {
        $('html, body').animate({
            scrollTop: $(`${hash}`).offset().top
        }, 800)
    }
    
    $('a.jump').click(function(){
        event.preventDefault();
        scroll(this.hash);
    })

    setTimeout(scroll.bind(null, '#intro'),3000)

})