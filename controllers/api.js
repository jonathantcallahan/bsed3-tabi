const path = require('path')
const fs = require('fs')
const log = console.log



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
    app.get('/api/pages', (req,res) => {
        pages = JSON.parse(fs.readFileSync('./public/scripts/pages.json','utf8'))
        console.log(pages)
        res.sendFile(pages)
    })
}