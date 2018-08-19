const log = console.log

console.log('asdf content test')

const content = {
    pageCont: () => {
        $('body').on('click','div.dy-cl', function(){
            log('asdf')
            const currentPage = $(this).attr('pg')
            $('div[pg=' + currentPage + '].dy-ex').find('i').attr('class','fas fa-plus dy-icon')
            $('div[pg=' + currentPage + '].dy-ex').attr('class','dy-content dy-cl')
            $(this).find('i').attr('class','fas fa-minus dy-icon')
            $(this).attr('class','dy-content dy-ex')
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
    }
}

content.pageCont()
content.buttonAnimation()