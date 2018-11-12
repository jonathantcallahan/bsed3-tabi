const log = console.log

console.log('asdf content test')

const content = {
    pageCont: () => {
        $('body').on('click','div.dy-cl', function(){
            log('asdf')
            const currentPage = $(this).attr('pg')
            $('div[pg=' + currentPage + '].dy-ex')
                .find('i')
                .attr('class','fas fa-plus dy-icon')
                .end()
                .attr('class','dy-content dy-cl')
                .find('div.dy-text')
                .removeClass('dy-show-text')
                .addClass('dy-fade-text')
            $(this).find('i').attr('class','fas fa-minus dy-icon')
            $(this)
                .attr('class','dy-content dy-ex')
                .find('div.dy-text')
                .removeClass('dy-fade-text')
                .addClass('dy-show-text')
        })
    },
    buttonAnimation: () => {
        let scrollPause = false;
        $('body').bind('mousewheel',function(e){
            log('scroll')
                if($('div.dy-continue').length){
                    log('scroll dy con')
                    if(scrollPause) return
                    $('div.dy-continue > div').addClass('text-fl')
                    scrollPause = true;
                    const rmButtonLg = () => {
                        $('div.dy-continue > div').removeClass('text-fl')
                        scrollPause = false;
                    }
                    setTimeout(rmButtonLg, 2000)
                }
        })
    },
    linkModal: () => {
        $('body').on('click','.dy-modal', function(){
            const modal = $('div.dy-link-modal-container')
            log(modal)
            if(modal.hasClass('dy-show-modal')) {
                modal
                    .removeClass('dy-show-modal')
                    .addClass('dy-hide-modal')
            } else {
                log('else ran')
                modal
                    .addClass('dy-show-modal')
                    .removeClass('dy-hide-modal')
            }
        })
    }
}

content.pageCont()
content.linkModal()
content.buttonAnimation()