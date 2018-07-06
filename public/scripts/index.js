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

    $('.answer-box').droppable({
        accept: '.selection',
        activeClass: 'highlight'
    })

    $('.options').droppable({
        accept: '.selection'
    })
    
    $('.selection').draggable({
        snap: true,
        distance: 5,
        revert: 'invalid',
        
        containment: 'window'

    })

    

})