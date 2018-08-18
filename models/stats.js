const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statSchema = new Schema({
    category: String,
    reason: String,
    votes: String
});

const Stats = mongoose.model('Stats',statSchema);

module.exports = Stats;