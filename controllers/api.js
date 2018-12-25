const path = require('path')
const fs = require('fs')
const log = console.log
const pagesPath = require('./../public/scripts/pages.json')


module.exports = (app, Stats) => {
    
    
    const addDb = (stat, cat) => {
        stat.forEach(e =>{
            Stats.find({reason:e})
                .then(f => {
                    if(f == undefined || f.length == 0){
                        log('new')
                        log(f) 
                        const data = new Stats({category:cat,reason:e,votes:'1'});
                        data.save();
                    } else {
                        const votes = parseInt(f[0].votes) + 1;
                        Stats.findOneAndUpdate({reason:e}, { $set: { votes: votes} }, { new: true }, (err, db) => {
                            log(db)
                        })
                    }
                })
        })
    };
    
    app.post('/api/:group', (req,res) => {
        addDb(req.body.choices, req.params.group)
        res.json('Success')
    });

    app.get('/api/data', (req,res) => {
        Stats.find({})
            .sort({category:'desc'})
            .then(e => res.json(e))
            .catch(r => res.status(500).json(r))
    })
<<<<<<< HEAD
    app.get('/api/pages/:section?', (req,res) => {
        //pages = JSON.stringify(pagesPath)
        
        console.log(req.params.section)
        console.log(pagesPath[req.params.section])
        const pages = JSON.stringify(pagesPath[req.params.section])
        res.json(pages)
=======
    app.get('/api/pages', (req,res) => {
        //res.send('testtest')
        const pages = fs.readFile('./controllers/pages.json','utf8',(err,data)=> {
            if(err)res.send(err)
            else {
                res.json(JSON.stringify(data))
            }
        })
        console.log(pages)
        //res.sendFile(path.join(__dirname,'./pages.json'))
>>>>>>> f456c843cfb500ff5ed61a7a10362561d59d51db
    })

}