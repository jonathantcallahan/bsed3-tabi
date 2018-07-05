$( document ).ready(function(){
    
    const log = console.log;

    const scroll = (hash, duration = 800) => {
        $('html, body').animate({
            scrollTop: $(`${hash}`).offset().top
        }, duration);
    }
    
    $('a.jump').click(function(){
        event.preventDefault();
        scroll(this.hash);
        console.log(this.hash)
    })

    setTimeout(scroll.bind(null, '#intro'),3000)

    $('.draggable').draggable({
        snap: true
    })

})