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
    }
}

content.pageCont()