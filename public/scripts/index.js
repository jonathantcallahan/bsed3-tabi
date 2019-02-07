$( document ).ready(function(){
    let apiPages = {}
    $.get('/api/pages', data => {
        apiPages = JSON.parse(data.replace(/open_tag/g,'<').replace(/close_tag/g,'>'))
    })
    const log = console.log;
    
    window.addEventListener('touchmove', function(e){
        log(e);
        const t = e.target.className;
        e.preventDefault();
    }, {passive: false})

    $('html').on('scroll mousewheel', function(e){
        console.log('scroll event')
        e.preventDefault()
        e.stopPropagation()
    }) 


    const scrolling = {
        scroll: (hash, duration = 800) => {
            log(hash);
            $('html, body').animate({
            scrollTop: $(`${hash}`).offset().top
            }, duration);
        }, 
        scrollText: [
            `Over the next few pages we'll be taking a close look at some big ideas.`,
            `As you explore, meet these topics with critical thought and an open mind.`,
            `Whether you are concerned about climate change, are trying to lead a healthier lifestyle, or are setting a budget`,
            `there is a chance that the issues that are important to you overlap with veganism.`,
            `Possibly in ways that you weren't aware of.`,
            `In the next section you'll select the issues that are important to you.`
        ], 
        scrollTextFunc: () => {
            $('div#page-two-text').text(scrolling.scrollText[0].toUpperCase());
            log(scrolling.scrollText[0]);
            let i = 1;
            const scrollMessages = function(){
                log(i);
                if(i === 6){ 
                    clearInterval(scrollMessageI); $('a.pg-2-link').text('CONTINUE'); 
                    $('div.loading-bar').css('visibility','hidden'); 
                    return; 
                };
                log(i);
                $('div#page-two-text').text(scrolling.scrollText[i].toUpperCase());
                i++;
            }
            const scrollMessageI = setInterval(scrollMessages, 5000);
        },
        //also put some random event listeners here
        eventATags: () => {
            $('body').on('click', 'a.jump', function(event){
                log('asdfasdf')
                event.preventDefault();
                $('.answer-box-exp').attr('class','answer-box-exp');
                if($(this).attr('id') === 'page-one-link'){
                    $('div.qoute-cont').attr('class','qoute-cont qoute-cont-animate');
                    $('.mobile-img-cont').attr('class','mobile-img-cont img-slide');
                    scrolling.scrollTextFunc();
                    $('div.loading-bar > div').attr('class','loading-stat');
                };
                if(this.hash === '#page-3' && sorting.reasons.length < 1){
                    $('#alert-1').attr('class','alert display');
                    return;
                } else {
                    scrolling.scroll(this.hash);
                    log(this.hash);
                    const t = this.hash.split('-');
                    const navId = `nav-${t[1]}`;
                    log(navId);
                    //log(t)
                    $('.page').attr('class','page');
                    $(`#${navId}`).attr('class','page current-page');
                };
                //add event listener and reasons logic for mobile selections
                $('.mobile-choice').unbind('click').click(function(){
                    log('clicked')
                    const c = $(this).attr('page');
                    const r = $(this).attr('id');
                    const s = $(this).attr('sel') === 't' ? true : false;
                    const i = $(this).attr('class');
                    const sortedIndex = sorting[c].indexOf(r);
                    sortedIndex === -1 ? 
                        sorting[c].push(r) :
                        sorting[c].splice(sortedIndex, 1)
                    log(sorting[c])
                    //sorting.sortItems(sorting[c],r,!s)
                    if(s){
                        $(this).attr('sel','f')
                        $(this).removeClass('selected')
                        log(s)
                    } else {
                        $(this).attr('sel','t')
                        $(this).addClass('selected')
                    }
                    let pageNum = c === 'reasons' ? 3 : 4
                    log(pageNum)
                    if(sorting[c].length === 3){
                        log('equals ran')
                        pageNum === 3 ?
                            $('a#reasons-link').trigger('click') :
                            $('a#concerns-link').trigger('click')
                    }
                })
            })
            $('.refresh').click(function(){
                $('i.fa-refresh').attr('class','fa fa-refresh rotate')
                setTimeout(window.location.reload.bind(window.location), 800)
            })
        },
        titleColor: 0,
        plantImages: ['./../media/images/leaf.png','./../media/images/leaf-2.png','./../media/images/leaf-3.png'],
        imageIndex: 0,
        bgPosition: 0,
        mouseWheel: function(){
            $('body').bind('mousewheel', function(e){
                let scrollPause = false
                if($('div.dy-continue').lenth){
                    if(scrollPause) return
                    $('div.dy-continue > div').addClass('text-fl')
                    scrollPause = true;
                    const rmButtonLg = () => {
                        $('div.dy-continue > div').removeClass('text-fl')
                        scrollPause = false;
                    }
                    setTimeout(rmButtonLg, 2000)
                }
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
        const indexT = e.indexOf(answerId) > -1;
        log(indexT);
        const index = e.indexOf(answerId);
        if(question){
            !indexT && e.push(answerId)
        } else {
            indexT && e.splice(index, 1)
        }
        log(sorting.reasons)
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
                    sorting.sortItems(sorting.concerns, answerId, question);   
                
                $('#alert-1').attr('class','alert');
                setTimeout($('.answer-box-exp').attr('class','answer-box-exp answer-fade'), 100);
                log(sorting.reasons);
                log(sorting.concerns);
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
    allPages: {},
    setPages: (cb=()=>{}) => {
        $.get('/api/pages', data => {
            // console.log(data)
            this.allPages = JSON.parse(data.replace(/oooo/g,'<').replace(/cccc/g,'>'))
            // console.log(this.allPages)
        })
    },
    createPage: pageNumber => {
        log('create pages ran')
        log(pageNumber)
        const pageScaffold = `
                    <section class='reasons-section' id='page-${pageNumber}'>
                        <a class='jump scaffold-link' href='#page-${pageNumber + 1}'><span>CONTINUE</span></a>
                    </section>`
        $(`#page-${pageNumber - 1}`).after(pageScaffold)
    },
    navT: 21,
    lineHeight: () => {
        const lnHeight = $('.line').height()
        let heightAnimate = parseInt(lnHeight - (lnHeight / 3))
        createPages.navT -= createPages.navT / 6
        $('#nav').css('top',`${createPages.navT}vw`) 
        $('.line').animate({height: `${heightAnimate}px`},500)
        const pageIcon = $('#nav-2').clone()
        const line = $('div.line').first().clone()
        pageIcon.attr('id',`nav-${pages}`)
        $('#nav').append(line).append(pageIcon)
        
    },
    paragraphTemplate: (content,i,e) => `
    <div class='dy-content ${i == 0 ? 'dy-ex' : 'dy-cl'}' pg='${e.pg}'>
        <div dy='dy-section-title-cont'>
            <div class='dy-section-title'>${content.header}<i class="fas ${i == 0 ? 'fa-minus' : 'fa-plus'} dy-icon"></i></div>
        </div>
        <div class='dy-text'>${content.content}</div>
    </div>
    `,
    desktopParagraphTemplate: (content, i, e) => {`
    <div class='dy-section-cont-d pg=${e.pg}>
        <div class='dy-section-title-cont-d ${i == 1 ? 'dy-selected' : 'dy-not-selected'}'></div>
    </div>
    `},
    linkTemplate: content => `<div class='dy-link-modal-link-container'><a href=${content[2]} target='_blank'><span>(${content[0]})</span>${content[1]}</a></div>`,
    sectionTemplate: content => `
    <div class='dy-title'>${content.title}</div>
            <div class='dy-blurb-cont secton-id='${content.pg}'>
                <div class='dy-blurb-cont-mobile'></div>
                <div class='dy-blurb-cont-desktop'></div>
                <div pg='${content.pg}' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title dy-section-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>${content.facts[0]}</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>${content.facts[1]}</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>${content.facts[2]}</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"${content.quote.quote}"
                    <br><span class='dy-qoute-name'>${content.quote.author}</span></span>
                </div>
            </div>    
            <div class='dy-infograph'>
                <div class='dy-img-cont' >
                    <img class='dy-img' src='${content.quote.img}'>
                    <div class='dy-circle'></div>
                </div>
            </div>
            <div class='dy-link-section'>
                <div class='dy-links'>
                    <div class='dy-links-title dy-modal'>SOURCES <i class="far fa-plus-square dy-src-icon"></i></div>
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                      
                        
                    </div>
                </div>
            </div>
        `,
    generateReasons: () => {
        $('a.create').click(function(){
            const category = $(this).attr('category')
            log(category)
          if(sorting[category].length > 0){
              sorting[category].forEach((e,i) => {
                  //console.log('category name',e)
                  switch(e){
                      case 'reason_health':
                        break;
                      case 'reason_animalW':
                        break;
                      case 'reason_worldH':
                        break;
                      case 'reason_climate':
                        break;
                      case 'reason_money':
                        break;
                      default:
                        e = 'reason_health'
                  }
                  createPages.createPage(pages);
                  createPages.lineHeight()
                  //$(`#page-${pages}`).append(createPages.pageHtml[e])
                  $(`#page-${pages}`).prepend(createPages.sectionTemplate(apiPages[e]))
                  //    console.log(apiPages)
                  const pg = apiPages[e]
                  apiPages[e].sections.forEach((e,i)=>{
                      // console.log(e)
                      // $(`#page-${pages}`).find('.dy-blurb-cont-desktop')
                      $(`#page-${pages}`).find('.dy-blurb-cont-mobile')
                        .prepend(createPages.paragraphTemplate(e,i,pg))
                  })
                  apiPages[e].sources.forEach(e => {
                      console.log(e, $(`#page-${pages} .dy-link-modal`))
                      $(`#page-${pages} .dy-link-modal`).append(createPages.linkTemplate(e))
                  })
                  // console.log('api pages',apiPages[e])
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


          const renderStats = () => {
            $.get('/api/data', data => {
                log(data)
                let max = 0;
                data.forEach(e => { 
                    log(e)
                    const barChart = `
                        <div class='ct-cont'>
                            <div class='ct-bar style='width:${parseInt(10000/ parseInt(e.votes))}px'>${e.reason}</div>
                        </div>
                    `
                    $('section.summary-page-1').append(barChart)
                })
            })
          }
          
          $.post(`/api/${category}`, { choices: sorting[category] })
            //.done(data => {log(data); category === 'concerns' && renderStats()});  
        })
    }

}

createPages.generateReasons()
createPages.setPages()
    
    
    

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