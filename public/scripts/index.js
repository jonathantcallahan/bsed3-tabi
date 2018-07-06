$( document ).ready(function(){
    
    const log = console.log;

    const reasons = [];

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

    const filterResults = {}

    $('.answer-box, .options').droppable({
        accept: '.selection',
        drop: function(event, ui) {
            console.log($(ui.draggable).attr('id'))
            console.log($(this).context.id)
        }
    })

    $('.answer-box').droppable('option','activeClass','highlight')

    
    $('.selection').draggable({
        snap: true,
        distance: 5,
        revert: 'invalid',
        appendTo: function(event, ui){
            console.log(event)
            console.log(ui)
        },
        containment: 'window'

    })

    $('.selection').click(function(){
        console.log($(this).parent().attr('class'))
        const parent = $(this).parent().attr('class')
    })
    

})