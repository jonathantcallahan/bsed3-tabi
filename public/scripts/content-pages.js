const log = console.log

const content = {
    pageCont: () => {
        $('body').on('click touchstart','div.dy-cl', function(){
            log('asdf')
            const currentPage = $(this).attr('pg')
            $('div[pg=' + currentPage + '].dy-ex')
                .find('i')
                .toggleClass('fa-plus fa-minus')
                .end()
                .removeClass('dy-ex')
                .addClass('dy-cl')
                .find('div.dy-text')
                .removeClass('dy-show-text')
                .addClass('dy-fade-text')
            $(this).find('i').toggleClass('fa-minus fa-plus')
            $(this)
                .removeClass('dy-cl')
                .addClass('dy-ex')
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
    timer: '_',
    linkModal: () => {
        $('body').on('click touchstart','.dy-modal', function(e){
            e.stopPropagation()
            const t = content.timer
            console.log(t)
            if (t == ''){ return }
            setTimeout(()=>content.timer='_',1000)
            content.timer = ''
            console.log($(this).attr('class'))
            if(e.type = 'touchstart'){
                $(this).off('click')
            }
            const modal = $('div.dy-link-modal-container')
            const icon = $('.dy-src-icon')
            log(modal)
            if(modal.hasClass('dy-show-modal')) {
                modal
                    .removeClass('dy-show-modal')
                    .addClass('dy-hide-modal')
                icon.removeClass('icon-rotate-l').addClass('icon-rotate-r')
            } else {
                log('else ran')
                modal
                    .addClass('dy-show-modal')
                    .removeClass('dy-hide-modal')
                icon.addClass('icon-rotate-l').removeClass('icon-rotate-r')
            }
        })
    }
}

content.pageCont()
content.linkModal()
content.buttonAnimation()