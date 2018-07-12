$( document ).ready(function(){
    
    const log = console.log;
    
    const scrolling = {
        scroll: (hash, duration = 800) => {
            log(hash)
            $('html, body').animate({
            scrollTop: $(`${hash}`).offset().top
            }, duration)
        },

        eventATags: () => {
            $('body').on('click', 'a.jump', function(){
                event.preventDefault();
                if(this.hash === '#page-2' && sorting.reasons.length < 1){
                    //log('asdf')
                    $('#alert-1').attr('class','alert display')
                    return;
                } else {
                    scrolling.scroll(this.hash);
                    log(this.hash);
                    const t = this.hash.split('-')
                    const navId = `nav-${t[1]}`
                    log(navId)
                    //log(t)
                    $('.page').attr('class','page')
                    $(`#${navId}`).attr('class','page current-page')
                }
            })
        },
     }

scrolling.eventATags();
scrolling.scroll('#page-0')

const sorting = {
    reasons: [],
    concerns: [],
    sortItems: (e, answerId, question) => {
        const indexT = e.indexOf(answerId) > -1
        const index = e.indexOf(answerId)
        if(question){
            !indexT && e.push(answerId)
        } else {
            indexT && e.splice(index, 1)
        }      
    },
    eventDroppable: () => {
        $('.answer-box, .options').droppable({
            accept: '.selection',
            drop: function(event, ui) {
                const answer = $(ui.draggable).attr('class')
                const answerId = $(ui.draggable).attr('id')
                const target = $(this).context.className
                const section = target.indexOf('one') > -1
                const question = target.indexOf('answer') > -1
                
                section ? 
                    sorting.sortItems(sorting.reasons, answerId, question) : 
                    sorting.sortItems(sorting.concerns, answerId, question)   
                
                $('#alert-1').attr('class','alert')
                log(sorting.reasons)
                log(sorting.concerns)
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
    },

}

sorting.eventDroppable();

pages = 3;
const createPages = {
    pageHtml: {
        reason_health: `
                <div>This will be what a generated page looks like</div>
        `,
        reason_animalW: `
                <div>This will be what a generated page looks like</div>
        `
    },
    createPage: pageNumber => {
        log('create pages ran')
        log(pageNumber)
        const pageScaffold = `
                    <section class='reasons-section' id='page-${pageNumber}'>
                        <a class='jump' href='#page-${pageNumber + 1}'>Continue</a>
                    </section>`
        $(`#page-${pageNumber - 1}`).after(pageScaffold)
    },
    lineHeight: () => {
        const lnHeight = $('.line').height()
        let heightAnimate = parseInt(lnHeight - (lnHeight / 5))
        $('.line').animate({height: `${heightAnimate}px`},500)
        const pageIcon = $('#nav-2').clone()
        const line = $('div.line').first().clone()
        pageIcon.attr('id',`nav-${pages}`)
        $('#nav').append(line).append(pageIcon)
        
    },
    generateReasons: () => {
        $('a.create').click(function(){
            const category = $(this).attr('category')
            log(category)
          if(sorting[category].length > 0){
              sorting[category].forEach((e,i) => {
                  createPages.createPage(pages);
                  createPages.lineHeight()
                  $(`#page-${pages}`).append(createPages.pageHtml[e])
                  pages++;
                  log(i)
              })
          }  
        })
    },
    generateCon: () => {
        $('a.con-create').click(function(){
            if(sorting.concerns.length > 0){
                sorting.concerns.forEach((e,i) => {
                    createPages.createPage(pages)
                })
            }
        })
    }
}

createPages.generateReasons()
    
    
    

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

    
    // Make qoute visible
    $('div.img-qoute-cont').mouseover(function(){
        $(this).find('div.qoute').attr('class','qoute qoute-visible')
    }).mouseout(function(){
        $(this).find('div.qoute').attr('class','qoute')
    })

})