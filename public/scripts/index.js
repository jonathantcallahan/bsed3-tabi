$( document ).ready(function(){
    
    const log = console.log;
    let page = 0;
    const reasons = [];
    const concerns = [];

    const scroll = (hash, duration = 800) => {
        $('html, body').animate({
            scrollTop: $(`${hash}`).offset().top
        }, duration);
    }
    
    $('a.jump').click(function(){
        event.preventDefault();
        if(this.hash === '#two-q' && reasons.length < 1){
            log('asdf')
            $('#alert-1').attr('class','alert display')
            return;
        } else {
            scroll(this.hash);
            console.log(this.hash);
            const t = $(this).attr('target')
            $('.page').attr('class','page')
            $(`#${t}`).attr('class','page current-page')
        }
    })

    // setTimeout(scroll.bind(null, '#interest-q'),3000)



    const sortItems = (e, answerId, question) => {
        const indexT = e.indexOf(answerId) > -1
        const index = e.indexOf(answerId)
        if(question){
            !indexT && e.push(answerId)
        } else {
            indexT && e.splice(index, 1)
        }
            
    }

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


            
            section ? 
                sortItems(reasons, answerId, question) : 
                sortItems(concerns, answerId, question)   
            

            log(answer)
            log(target)
            log(reasons)
            log(concerns)
            $('#alert-1').attr('class','alert')
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

    // $('.selection').click(function(){
    //     console.log($(this).parent().attr('class'))
    //     const parent = $(this).parent().attr('class')
    //     const question = parent.indexOf('options') > -1
    //     const section = parent.indexOf('one') > -1
    //     log(question)
    //     log(parent)
        
    //     question ?
    //         $(this).appendTo('#intro-answer-box') :
    //         $(this).appendTo('#intro-options')
    // })
    

})