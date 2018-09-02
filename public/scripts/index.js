$( document ).ready(function(){
    
    const log = console.log;
    
    const scrolling = {
        scroll: (hash, duration = 800) => {
            log(hash);
            $('html, body').animate({
            scrollTop: $(`${hash}`).offset().top
            }, duration);
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
            log(scrolling.scrollText[0]);
            let i = 1;
            const scrollMessages = function(){
                log(i);
                if(i === 6){ clearInterval(scrollMessageI); $('a.pg-2-link').css('visibility','visible'); $('div.loading-bar').css('visibility','hidden'); return };
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
    pageHtml: {
        reason_health: `
        <div class='dy-title'>PHYSICAL HEALTH</div>
        <div class='dy-blurb-cont'>
            <div class='dy-content dy-ex' pg='c_health'>
                <div dy='dy-section-title-cont'>
                    <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                </div>
                <div class='dy-text'>
                    Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                        and a higher risk of heart disease. (1)</span> In addition, <span class='dy-modal-link dy-modal'>meat and animal products often contain harsh chemical preservatives, antibiotics, carcinogens, 
                            and added hormones (2)</span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer (3)</span>. Diets heavy in animal products 
                    have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                </div>
            </div>
            <div class='dy-content dy-cl' pg='c_health'>
                <div dy='dy-section-title-cont'>
                    <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                </div>
                <div class='dy-text'>
                    Plant heavy diets naturally tend to have <span class='dy-modal-link dy-modal'>healthier macro ratios (4)</span>  (fats/ carbs/ protein) as well as <span class='dy-modal-link dy-modal'>more vitamins and minerals that the body can easily absorb. (5)</span> Plants are high in fiber which
                    <span class='dy-modal-link dy-modal'>improves digestive health. (6)</span> Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome (7)</span> which has far reaching health effects. The low calorie density of many plant-centric meals
                    helps with <span class='dy-modal-link dy-modal'>losing excess weight. (8)</span> <span class='dy-modal-link dy-modal'>Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc (9)</span>
                </div>
            </div>
            <div class='dy-content dy-cl' pg='c_health'>
                <div dy='dy-section-title-cont'>
                    <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                </div>
                <div class='dy-text'>
                    Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>stronger nails and hair (10)</span>, whiter teeth, <span class='dy-modal-link dy-modal'>less fatigue (11)</span>,  <span class='dy-modal-link dy-modal'>clearer skin (12)</span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor (13)</span>, 
                    better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health (14)</span>.  
                        
                </div>
            </div>
            <div class='dy-fact-cont'>
                <div class='dy-fact-title'>QUICK FACTS</div>
                <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
            </div>
            <div class='dy-qoute'>
                <span class='dy-qoute-text'>In the next ten years, one of the things you’re bound to hear is that animal protein is one of the most toxic nutrients of all that can be considered. Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be.
                <br><span class='dy-qoute-name'>T. Colin Campbell, PhD, nutritional biochemist, Cornell</span></span>
            </div>
        </div>    
        <div class='dy-infograph'>
            <div class='dy-img-cont' >
                <img class='dy-img' src='./../media/images/tcc-png.png'>
                <div class='dy-circle'></div>
            </div>
        </div>
        <div class='dy-link-section'>
            <div class='dy-links'>
                <div class='dy-links-title dy-modal'>SOURCES <i class="far fa-plus-square dy-src-icon"></i></div>
                <!--<span class='dy-link'>(1)<a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
            </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
            <div class='dy-link-modal-container dy-modal'>
                <div class='dy-link-modal'>
                    <a href='' target='_blank'>(1) site.com</a>
                    <a href='' target='_blank'>(2) site.com/a-longer-url</a>
                    <a href='' target='_blank'>(3) site.com</a>
                </div>
            </div>
        </div>
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
                        <a class='jump scaffold-link' href='#page-${pageNumber + 1}'><span>CONTINUE</span></a>
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
            .done(data => {log(data); category === 'concerns' && renderStats()});  
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