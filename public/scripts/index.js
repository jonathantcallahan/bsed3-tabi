$( document ).ready(function(){
    
    const log = console.log;

    const reasons = [];
    const concerns = [];

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

    setTimeout(scroll.bind(null, '#interest-q'),3000)

    $('.answer-box, .options').droppable({
        accept: '.selection',
        drop: function(event, ui) {
            const answer = $(ui.draggable).attr('class')
            const answerId = $(ui.draggable).attr('id')
            const target = $(this).context.className
            const section = target.indexOf('one') > -1
            const question = target.indexOf('answer') > -1
            log(section)
            log(question)


            const sortItems = e => {
                if(question){
                    e.push(answerId)
                } else {
                    log('rem answer')
                    const index = e.indexOf(answerId);
                    e.splice(index, 1)
                }
                    
            }
            
            section ? sortItems(reasons) : sortItems(concerns)   
            

            log(answer)
            log(target)
            log(reasons)
            log(concerns)
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
        containment: 'window',
        activeClass: 'drag'

    })

    $('.selection').click(function(){
        console.log($(this).parent().attr('class'))
        const parent = $(this).parent().attr('class')
    })
    

})