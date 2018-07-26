$( document ).ready(function(){
    
    const log = console.log;
    
    const scrolling = {
        scroll: (hash, duration = 800) => {
            log(hash)
            $('html, body').animate({
            scrollTop: $(`${hash}`).offset().top
            }, duration)
        },
        scrollText: [
            `Over the next few pages we'll be taking a close look at some ideas that are heavily engrained in many cultures around the world.`,
            `As you explore the site please try to meet these topics with critical individual thought and an open mind.`,
            `Whether you are concerned about climate change, are trying to lead a healthier lifestyle, or are setting a budget,`,
            `there is a chance that the issues that are important to you overlap with veganism.`,
            `Possibly in ways that you weren't aware of.`,
            `In the next section you'll select the issues that are important to you.`
        ],
        scrollTextFunc: () => {
            $('div#page-two-text').text(scrolling.scrollText[0].toUpperCase());
            log(scrolling.scrollText[0])
            let i = 1;
            const scrollMessages = function(){
                log(i)
                if(i === 6){ clearInterval(scrollMessageI); $('a.pg-2-link').css('visibility','visible'); $('div.loading-bar').css('visibility','hidden'); return }
                log(i)
                $('div#page-two-text').text(scrolling.scrollText[i].toUpperCase());
                i++;
            }
            const scrollMessageI = setInterval(scrollMessages, 5000)
        },
        eventATags: () => {
            $('body').on('click', 'a.jump', function(){
                event.preventDefault();
                if($(this).attr('id') === 'page-one-link'){
                    $('div.qoute-cont').attr('class','qoute-cont qoute-cont-animate')
                    $('.mobile-img-cont').attr('class','mobile-img-cont img-slide')
                    scrolling.scrollTextFunc()
                    $('div.loading-bar > div').attr('class','loading-stat')
                }
                if(this.hash === '#page-3' && sorting.reasons.length < 1){
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
            $('.refresh').click(function(){
                setTimeout(window.location.reload.bind(window.location), 800)
            })
        },
        titleColor: 0,
        plantImages: ['./../media/images/leaf.png','./../media/images/leaf-2.png','./../media/images/leaf-3.png'],
        imageIndex: 0,
        bgPosition: 0,
        mouseWheel: function(){
            $('body').bind('mousewheel', function(e){
                log(e.originalEvent.wheelDelta)
                const scroll = e.originalEvent.wheelDelta;
                
                $('#front-title').css('background-image',`url(${scrolling.plantImages[scrolling.imageIndex]})`)
                scrolling.imageIndex  < 2 ? scrolling.imageIndex++ : scrolling.imageIndex = 0;
                if(scroll < 0){
                    scrolling.bgPosition += .2
                    $('#page-1').css('background-position-y',`${scrolling.bgPosition}vw`)
                    $('.overlay-image').css('background-position-x',`${scrolling.bgPosition}vw`)
                } else {
                    scrolling.bgPosition -= .2
                    $('#page-1').css('background-position-y',`${scrolling.bgPosition}vw`)
                    $('.overlay-image').css('background-position-x',`${scrolling.bgPosition}vw`)
                }
                // if(scroll < 0){
                //     log(scrolling.titleColor)
                //     log('up')
                //     if(scrolling.titleColor > 250) return;
                //     scrolling.titleColor += 5;
                //     $('#front-title').css('color',`rgb(0,${scrolling.titleColor},${scrolling.titleColor/2}`)
                // } else {
                //     log(scrolling.titleColor)
                //     if(scrolling.titleColor < 5) return;
                //     scrolling.titleColor -= 5;
                //     $('#front-title').css('color',`rgb(0,${scrolling.titleColor},${scrolling.titleColor/2} `)
                //     log('down')
                // }
            })
        }
     }

scrolling.eventATags();
scrolling.scroll('#page-0')
scrolling.mouseWheel()

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
        $('.answer-box, .options').sortable()
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

pages = 4;
const createPages = {
    pageHtml: {
        reason_health: `
                <div>This will be what a generated page looks like</div>
        `,
        reason_animalW: `
                <div>This will be what a generated page looks like</div>
        `,
        concern_peer: `
        <div class='pop-cont' id='celeb-cont'>
                <div class='img-qoute-cont celeb-jp'>
                    <div class='qoute'>It takes nothing away from a human to be kind to an animal <br><span class='qoute-name'>Joaquin Phoenix</span></div>
                    <img class='pop-img' src='./../media/images/jp-png.png'>
                </div>
                <div class='img-qoute-cont'>
                    <div class='qoute'>In this world that is spinning madly out of control, we have to realize that we’re all related. We have to try to live harmoniously.
                        <br><span class='qoute-name'>Woody Harrelson</span>
                    </div>
                    <img class='pop-img' src='./../media/images/wh-png.png'>
                </div>
                <div class='img-qoute-cont'>
                        <div class='qoute'>People don't think about how each of these animals that we call dinner have the same kinds of personalities as our dogs and cats.
                            <br><span class='qoute-name'>Emily Deschanel</span>
                        </div>
                        <img class='pop-img' src='./../media/images/em-png.png'>
                </div>
                <div class='img-qoute-cont'>
                        <div class='qoute'>I like animals, all animals. I wouldn't hurt a cat or a dog - or a chicken or a cow. And I wouldn't ask someone else to hurt them for me. That's why I'm a vegan.
                            <br><span class='qoute-name'>Peter Dinklage</span>
                        </div>
                        <img class='pop-img' src='./../media/images/pd-png.png'>
                </div>
            </div>
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
    navT: 21,
    lineHeight: () => {
        const lnHeight = $('.line').height()
        let heightAnimate = parseInt(lnHeight - (lnHeight / 5))
        createPages.navT -= createPages.navT / 6
        $('#nav').css('top',`${createPages.navT}vw`) 
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
                log(sorting[category].length)
                  log(i)
                  if(sorting[category].length === i + 1 && category === 'concerns'){
                    $('section.summary-page-1').attr('id',`page-${pages}`)
                    $('a.link-summary-page-1').attr('href',`#page-${pages + 1}`)
                    $('section.thank-you').attr('id',`page-${pages + 1}`)
                    createPages.lineHeight()
                    pages++
                    createPages.lineHeight()
                  }
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
    $('body').on('mouseover','div.img-qoute-cont', function(){
        $(this).find('div.qoute').attr('class','qoute qoute-visible')
    }).mouseout(function(){
        $(this).find('div.qoute').attr('class','qoute')
    })

})