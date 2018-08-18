const path = require('path')



module.exports = (app, Stats) => {
    
    
    const addDb = stat => {

    };
    
    app.post('/api/reasons', (req,res) => {
        console.log(req.body);
        res.json('Success')
    })
}