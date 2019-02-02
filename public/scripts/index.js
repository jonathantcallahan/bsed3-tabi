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
            `Over the next few pages we'll be taking a close look at some ideas that are heavily engrained in many cultures around the world.`,
            `As you explore, please try to meet these topics with critical thought and an open mind.`,
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
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg ='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        reason_animalW: `
        <div class='dy-title'>ANIMAL WELFARE</div>
        <div class='dy-blurb-cont'>
            <div class='dy-content dy-ex' pg='i_animal_welfare'>
                <div dy='dy-section-title-cont'>
                    <div class='dy-section-title'>ANIMAL INTELLIGENCE<i class="fas fa-minus dy-icon"></i></div>
                </div>
                <div class='dy-text'>
                    <span class='dy-modal-link dy-modal'>Pigs (1) </span>are smarter than dogs/ 3 year old humans, can recognize themselves in a mirror, have likes and dislikes, form strong bonds with their young and sing to them while nursing, and are deeply social and emotional animals. 
                    <span class='dy-modal-link dy-modal'>Cows (2) </span>have best friends, long memories, and can keep grudges. They can understand cause and effect, and get excited after solving a problem. 
                    <span class='dy-modal-link dy-modal'>Chickens (3) </span>posess self control and can identify their own position in social order (both indicitive of self-awareness), have complex communication, and demonstrate empathy. 
                </div>
            </div>
            <div class='dy-content dy-cl' pg='i_animal_welfare'>
                <div dy='dy-section-title-cont'>
                    <div class='dy-section-title'>FARM CONDITIONS<i class="fas fa-plus dy-icon"></i></div>
                </div>
                <div class='dy-text'>
                    The treatment of animals in factory farms is incomprehensibly cruel, 
                    if you are interested in the details they can be <a href='http://www.lcanimal.org/index.php/campaigns/other-issues/factory-farming' target='_blank'>found easily online</a>. I will avoid them here to spare younger readers. 
                    <span class='dy-modal-link dy-modal'>Animals used for food spend their life in semi-darkness, in cages the size of their bodies, are forcibly impregenated and have their young taken, 
                    and are slaughtered in horriffc ways often without being stunned. Unable to engage in their natural behavior, these intelligent and emotionally complex animals usually go insane. (4)</span>
                    Recommended watching: <a href='http://www.nationearth.com/' target='_blank'>Earthlings</a>.   
                </div>
            </div>
            <div class='dy-content dy-cl' pg='i_animal_welfare'>
                <div dy='dy-section-title-cont'>
                    <div class='dy-section-title'>COMPASSION<i class="fas fa-plus dy-icon"></i></div>
                </div>
                <div class='dy-text'>
                    Dr. J. Kong speaks on compassion in this short clip from her TED Talk.

                    <iframe width="560" height="315" src="https://www.youtube.com/embed/eZWzNfOpbCQ?rel=0&amp;start=452" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class='dy-yt-clip'></iframe>

                        
                </div>
            </div>
            <div pg='i_animal_welfare' class='dy-content dy-fact-cont dy-cl'>
                <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>Pigs have been known to sing to their young while nursing</div>
                <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>Cows have their newborns taken away so their milk can be sold</div>
                <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>370 Animals are killed in America every second</div>
            </div>
            <div class='dy-qoute'>
                <div class='dy-qoute-title'>QOUTE</div>
                <span class='dy-qoute-text'>"It takes nothing away from a human to be kind to an animal."
                <br><span class='dy-qoute-name'>Joaquin Pheonix</span></span>
            </div>
        </div>    
        <div class='dy-infograph'>
            <div class='dy-img-cont' >
                <img class='dy-img' src='./../media/images/jp-png.png'>
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
                    <a href='https://escholarship.org/uc/item/8sx4s79c' target='_blank'>(1) Journal of Comparative Psychology</a>
                    <a href='http://animalbehaviorandcognition.org/uploads/journals/17/AB&C_2017_Vol4(4)_Marino_Allen.pdf ' target='_blank'>(2) Journal of Animal Behavior and Cognition</a>
                    <a href='https://link.springer.com/article/10.1007/s10071-016-1064-4 ' target='_target'>(3) Journal of Animal Cognition</a>
                    <a href='https://www.aspca.org/animal-cruelty/farm-animal-welfare ' target='_blank'>(4) ASPCA</a>
                </div>
            </div>
        </div>
        `,
        reason_worldH: `
            <div class='dy-title'>WORLD HUNGER</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='i_world_hunger'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>DIMINISHED RETURN<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        <span class='dy-modal-link dy-modal'>For every 100 calories that an animal eats, only 12 make it to humans as meat. <span>(1)</span> </span> 
                        This means that in order to produce any amount of meat there needs to be a hugely disporportionate amount of crops grown to feed to those animals. 
                        Which combined with other factors of animal production has a cascading impact on the global availability of food which we'll discuss here.  
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='i_world_hunger'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>CROPS TO FEED LIVESTOCK<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        <span class='dy-modal-link dy-modal'>36% of all crops grown go to feed animals. <span>(1)</span></span> In fact raising animals for food, including land for grazing and growing feed crops, 
                        currently uses <span class='dy-modal-link dy-modal'>over one-third of the earths land mass. <span>(3)</span></span> Researchers determined that if this land was used instead for a nutritionally equivalent combination of edible plants 
                        the total food available in the world would <span class='dy-modal-link dy-modal'>increase by 120%. <span>(4)</span></span> Taking the crops that are being grown for livestock now and feeding them to people instead would be
                        more than enough to <span class='dy-modal-link dy-modal'>entirely end world hunger. <span>(4)</span></span> <span class='dy-modal-link dy-modal'>30% of all fish caught are used as animal feed as well <span>(3)</span></span>
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='i_world_hunger'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>POPULATION GROWTH<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                            <span class='dy-modal-link dy-modal'>Currently 850 million people around the world are suffering from hunger and every year starvation kills 2.5 million children under the age of five. <span>(5)</span> </a> 
                            Even still, the global population is projected to grow by over 2 billion in the next 30 years. Sustainability and ethics aside, 
                            due to the diminishing caloric return of animal products <span class='dy-modal-link dy-modal'>it will be physically impossible to sustain the world population on a meat based diet. <span>(2)</span> </a>
                            The U.N.'s plan to end world hunger by 2030 is based on drastically reducting the amount of meat in diets worldwide.    
                    </div>
                </div>
                <div class='dy-content dy-fact-cont dy-cl' pg='i_world_hunger'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>One-third of the worlds landmass is used for animal agriculture</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>850 million people around the world are suffering form hunger</div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>The crops grown to feed animals could end world hunger right now</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Diets will have to change"
                    <br><span class='dy-qoute-name'>Michael Obersteiner, Programs Director Ecosystems Services IIASA</span></span>
                </div>
            </div>    
            <div class='dy-infograph'>
                <div class='dy-img-cont' >
                    <img class='dy-img' src='./../media/images/mo-png.png'>
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
                        <a href='http://iopscience.iop.org/article/10.1088/1748-9326/8/3/034015/pdf;jsessionid=95EDE4930C45CA55680F9ECEA309C909.c2.iopscience.cld.iop.org ' target='_blank'><span>(1)</span> IOP Publishing</a>
                        <a href='http://www.unep.fr/shared/publications/pdf/dtix1262xpa-priorityproductsandmaterials_report.pdf' target='_blank'><span>(2)</span> United Nations</a>
                        <a href='https://www.sciencenews.org/blog/wild-things/most-fish-turned-fishmeal-are-species-we-could-be-eating?mode=blog&context=116' target='_target'><span>(3)</span> Science News</a>
                        <a href='http://www.pnas.org/content/115/15/3804' target='_blank'><span>(4)</span> National Academy of Sciences</a>
                        <a href='http://www1.wfp.org/zero-hunger' target='_blank'><span>(5)</span> World Food Project</a>
                    </div>
                </div>
            </div>
        `,
        reason_climate: `
        <div class='dy-title'>ENVIRONMENT</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='i_climate_and_environment'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>GLOBAL WARMING<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                            Livestock and their byproducts account for approximately <span class='dy-modal-link dy-modal'>51% of all worldwide greenhouse gas emissions <span>(1)</span> </span>, and those emissions are expected to <span class='dy-modal-link dy-modal'>increase by 80% by 2050 <span>(2)</span></span>. 
                            <strong>If we stopped all fossil fuel use today, <span class='dy-modal-link dy-modal'>we are still on track to exceed our atmospheric greenhouse gas maximum of 32 gigatons by 2030 from livestock emissions alone <span>(4)</span></span></strong>. 
                            Animal agriculture is responsible for <span class='dy-modal-link dy-modal'>80% of the worlds total deforestation <span>(3)</span></span> which compounds the damage of the emissions.   
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='i_climate_and_environment'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>LAND ECOSYSTEMS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                            We are currently in the middle of the <span class='dy-modal-link dy-modal'>largest mass extinction in 65 million years <span>(5)</span></span>. <span class='dy-modal-link dy-modal'>1/3 of all landmass is used for animal agriculture <span>(6)</span></span>, 
                            and <span class='dy-modal-link dy-modal'>1/3 is desertified with animal agriculture as the driving force <span>(7)</span></span>. Animal agriculture is responsible for <span class='dy-modal-link dy-modal'>91% of the deforestation of the Amazon <span>(8)</span></span> (the land is used to graze animals and grow feed crops) 
                            with <span class='dy-modal-link dy-modal'>1-2 acres being lost every second <span>(9)</span></span>. Other industries (logging, farming, etc.) certainly play a role, however animal agriculture is destroying ecosystems at a rate that dwarfs all of these other industries combined.


                    </div>
                </div>
                <div class='dy-content dy-cl' pg='i_climate_and_environment'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>OCEAN HEALTH<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                            Around <span class='dy-modal-link dy-modal'>2.7 trillion animals are pulled out of the ocean every year <span>(10)</span></span>. <span class='dy-modal-link dy-modal'>For every 1 pound of fish that are caught, 5 pounds of unintented marine species are discarded as by-kill <span>(11)</span></span>. 
                            <span class='dy-modal-link dy-modal'>3/4 of the wolrds oceans are already depleted <span>(12)</span></span>and we could see fishless oceans by <span class='dy-modal-link dy-modal'>as early as 2048 <span>(13)</span></span>. As many as <span class='dy-modal-link dy-modal'>650 thousand dolphins and whales <span>(14)</span></span>, 
                            and <span class='dy-modal-link dy-modal'>40 - 50 million sharks <span>(15)</span></span>are killed every year. <span class='dy-modal-link dy-modal'>46% of the plastic in the ocean is from commercial fishing <span>(16)</span></span>. 
                            Livestock operations on land have created <span class='dy-modal-link dy-modal'>more than 500 nitrogen flooded deadzones around the ocean <span>(17)</span>. </span>    
                    </div>
                </div>
                <div class='dy-content dy-fact-cont dy-cl' pg='i_climate_and_environment'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>Animal agriculture is responsible for 91% of Amazon deforestation</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet saves 20lbs of CO2 and 30 sq ft of forested land daily</div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Animal agriculture is the leading producer of greenhouse gasses</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Diets will have to change"
                    <br><span class='dy-qoute-name'>Michael Obersteiner, Programs Director Ecosystems Services IIASA</span></span>
                </div>
            </div>    
            <div class='dy-infograph'>
                <div class='dy-img-cont' >
                    <img class='dy-img' src='./../media/images/mo-png.png'>
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
                        <a href=http://www.worldwatch.org/files/pdf/Livestock%20and%20Climate%20Change.pdf '' target='_blank'><span>(1)</span> World Watch</a>
                        <p>** Older sources may cite a lower number for this statistic, this is due to the growth of animal agriculture in the past decade</p>
                        <a href='https://www.nature.com/articles/nature13959' target='_blank'><span>(2)</span> Nature</a>
                        <a href='https://www.sciencedaily.com/releases/2012/09/120925091608.htm' target='_blank'><span>(4)</span> Science Daily</a>
                        <a href='http://comfortablyunaware.com/blog/cop-19-and-climate-change-the-path-to-resolution/' target='_blank'><span>(3)</span> Comfortably Unaware</a>
                        <p>** calculation is based on <a href='http://www.worldwatch.org/node/6294'>worldwatch.org</a> analyses that 51% of GHG are attributed to animal ag.</p>
                        <a href='http://www.actionbioscience.org/evolution/eldredge2.html' target='_blank'><span>(5)</span> Action Bioscience</a>
                        <a href='http://science.time.com/2013/12/16/the-triple-whopper-environmental-impact-of-global-meat-production/' target='_blank'><span>(6)</span> Time</a>
                        <a href='https://news.un.org/en/story/2006/01/165052-un-launches-international-year-deserts-and-desertification#.WPIC62dFfIV' target='_blank'><span>(7)</span> UN</a>
                        <a href='https://www.nytimes.com/2017/02/24/business/energy-environment/deforestation-brazil-bolivia-south-america.html?_r=0' target='_blank'><span>(8)</span> NY Times</a>
                        <a href='https://www.scientificamerican.com/article/earth-talks-daily-destruction/' target='_blank'><span>(9)</span> Scientific American</a>
                        <a href='http://www.fishcount.org.uk/published/std/fishcountstudy.pdf' target='_blank<span>'>(10)</span> Fishcount</a>
                        <a href='http://www.fao.org/docrep/W6602E/w6602E09.htm' target='_blank<span>'>(11)</span> FAO</a>
                        <a href='http://www.fao.org/newsroom/common/ecg/1000505/en/stocks.pdf' target='_blank<span>'>(12)</span> FAO</a>
                        <a href='https://www.nationalgeographic.com/animals/2006/11/seafood-biodiversity/' target='_blank<span>'>(13)</span> National Geographic</a>
                        <a href='http://oceana.org/sites/default/files/reports/Bycatch_Report_FINAL.pdf' target='_blank<span>'>(14)</span> Oceana</a>
                        <a href='http://wormlab.biology.dal.ca/publication/view/worm-etal-2013-global-catches-exploitation-rates-and-rebuilding-options-for-sharks/' target='_blank<span>'>(15)</span> Marine Policy</a>
                        <a href='https://www.nature.com/articles/s41598-018-22939-w' target='_blank<span>'>(16)</span> Nature</a>
                        <a href='https://www.smithsonianmag.com/science-nature/ocean-dead-zones-are-getting-worse-globally-due-climate-change-180953282/' target='_blank<span>'>(17)</span> Smithsonian</a>
                    </div>
                </div>
            </div>
        `,
        _concern_peer: `
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
        `,
        reason_money: `
        <div class='dy-title work-in-progress'>SAVING MONEY</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        reason_atheletic: `
        <div class='dy-title'>ATHLETIC PERFORMANCE</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        reason_spiritual: `
        <div class='dy-title'>SPIRITUALITY</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        reason_healthM: `
        <div class='dy-title'>MENTAL HEALTH</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_peer: `
        <div class='dy-title'>PEER PRESSURE</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_taste: `
        <div class='dy-title'>TASTE</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_evol: `
        <div class='dy-title'>EVOLUTION</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_prot: `
        <div class='dy-title'>PROTEIN</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_cost: `
        <div class='dy-title'>COST</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_habit: `
        <div class='dy-title'>HABIT</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_animals: `
        <div class='dy-title'>HAPPY ANIMALS</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_health: `
        <div class='dy-title'>HEALTH RISK</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `,
        concern_manly: `
        <div class='dy-title'>NOT MANLY</div>
            <div class='dy-blurb-cont'>
                <div class='dy-content dy-ex' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF ANIMAL PRODUCTS<i class="fas fa-minus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Meat and other animal products tend to be high in saturated fats and dietary cholesterol which can contribute to <span class='dy-modal-link dy-modal'>higher rates of obesity 
                            and a higher risk of heart disease. <span>(1)</span></span> In addition, meat and animal products often contain <span class='dy-modal-link dy-modal'>antibiotics <span>(15)</span></span>, <span class='dy-modal-link dy-modal'>carcinogens <span>(16)</span></span>, 
                                and <span class='dy-modal-link dy-modal'>added hormones <span>(2)</span></span>. Meat heavy diets are associated with a <span class='dy-modal-link dy-modal'>significantly higher level of risk of developing cancer <span>(3)</span></span>. Diets heavy in animal products 
                        have also been linked to chronic lower respiratory disease, diabetes, stroke and cerebrovascular disease, and kidney disease.
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>HEALTH IMPACT OF PLANTS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Plant heavy diets naturally tend to have healthier macro ratios (fats/ carbs/ protein). Plants are high in fiber which
                        <span class='dy-modal-link dy-modal'>improves digestive health <span>(6)</span></span>, and also contain <span class='dy-modal-link dy-modal'>several other important vitamins and minerals <span>(5)</span></span>. Vegan and vegetarian diets have been shown to support a <span class='dy-modal-link dy-modal'>healthier gut microbiome <span>(7)</span></span> which has far reaching health effects. The low calorie density of many plant-centric meals
                        helps with <span class='dy-modal-link dy-modal'>losing excess weight. <span>(8)</span></span> Poorly planned vegan diets may provide insufficient amounts of essential fatty acids, vitamin B12, iron, calcium, iodine or zinc 
                    </div>
                </div>
                <div class='dy-content dy-cl' pg='c_health'>
                    <div dy='dy-section-title-cont'>
                        <div class='dy-section-title'>NOTICEABLE PHYSICAL BENEFITS<i class="fas fa-plus dy-icon"></i></div>
                    </div>
                    <div class='dy-text'>
                        Some of the more noticeable phsical benefits of a vegan diet include <span class='dy-modal-link dy-modal'>clearer skin <span>(12)</span></span>, <span class='dy-modal-link dy-modal'>reduced bad breath and less body odor <span>(11)</span></span>, 
                        better digestive health, and <span class='dy-modal-link dy-modal'>improved sexual health <span>(14)</span></span>. While there is anecdotal evidence for everything from whiter teeth and strong nails to increased energy, significant studies
                        have not been done. It is likely many of these benefits have more do with overall improvements in diet that come along with a vegan diet like less processed foods and sugar than the absence of animal products.
                            
                    </div>
                </div>
                <div pg='c_health' class='dy-content dy-fact-cont dy-cl'>
                    <div class='dy-fact-title'>QUICK FACTS<i class="fas fa-plus dy-icon dy-icon-fact"></i></div>
                    <div class='dy-fact-body'><i class="fas fa-heart dy-fact-icon"></i>Vegans naturally have better breath and less body odor</div>
                    <div class='dy-fact-body'><i class="fas fa-walking dy-fact-icon"></i>A vegan diet reduces the risk of heart disease by 40%</div>
                    <div class='dy-fact-body'><i class="fas fa-utensils dy-fact-icon"></i>A vegan diet reduces the risk of developing cancer by 15%</div>
                </div>
                <div class='dy-qoute'>
                    <div class='dy-qoute-title'>QOUTE</div>
                    <span class='dy-qoute-text'>"Quite simply, the more you substitute plant foods for animal foods, the healthier you are likely to be."
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
                    <!--<span class='dy-link'><span>(1)</span><a class='dy-source' href='wikipedia.com'>Wikipedia.com</a></span>-->
                </div><div class='dy-continue'><!--<div>CONTINUE</div>--></div>
                <div class='dy-link-modal-container dy-modal'>
                    <div class='dy-link-modal'>
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank<span>'>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target<span>'>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
                    </div>
                </div>
            </div>
        `
    },
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
        let heightAnimate = parseInt(lnHeight - (lnHeight / 5))
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
                        <a href='https://www.health.harvard.edu/staying-healthy/becoming-a-vegetarian' target='_blank'><span>(1)</span> Harvard Health</a>
                        <a href='https://www.pbs.org/wgbh/pages/frontline/shows/meat/safe/overview.html' target='_blank'><span>(15)</span> PBS Frontline</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_target'><span>(16)</span> World Health Organization</a>
                        <a href='https://www.everydayhealth.com/digestive-health/go-vegetarian-without-the-gas.aspx' target='_blank'><span>(2)</span> Everydayhealth.com</a>
                        <a href='http://www.who.int/features/qa/cancer-red-meat/en/' target='_blank'><span>(3)</span> World Health Organization</a>
                        <a href='https://www.ncbi.nlm.nih.gov/pubmed/12740075' target='_blank'><span>(5)</span> NCBI</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(6)</span> Mayo Clinic</a>
                        <a href='https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983' target='_blank'><span>(7)</span> NCBI </a>
                        <a href='https://www.healthline.com/nutrition/vegan-diet-studies' target='_blank'><span>(8)</span> Healthline </a>
                        <a href='https://www.allure.com/story/do-vegans-have-better-skin' target='_blank<span>'>(12)</span> Allure</a>
                        <a href='https://www.psychologytoday.com/us/blog/animals-and-us/201701/do-vegetarians-smell-sexier' target='_blank<span>'>(11)</span> Psychology Today</a>
                        <a href='https://www.menshealth.com/sex-women/a19534211/the-sex-secret-vegans-know/' target='_blank<span>'>(14)</span> Men's Health</a>
                        
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
                  console.log('category name',e)
                  e = 'reason_health'
                  createPages.createPage(pages);
                  createPages.lineHeight()
                  //$(`#page-${pages}`).append(createPages.pageHtml[e])
                  $(`#page-${pages}`).append(createPages.sectionTemplate(apiPages[e]))
                  //    console.log(apiPages)
                  const pg = apiPages[e]
                  apiPages[e].sections.forEach((e,i)=>{
                      console.log(e)
                      // $(`#page-${pages}`).find('.dy-blurb-cont-desktop')
                      $(`#page-${pages}`).find('.dy-blurb-cont-mobile')
                        .prepend(createPages.paragraphTemplate(e,i,pg))
                  })
                  console.log('api pages',apiPages[e])
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