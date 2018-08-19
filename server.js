const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

const mongoose = require('mongoose');
const MONGODB_URI = process.env.OPENSHIFT_MONGODB_URL + 'stats' || 'mongodb://localhost:27017/stats';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
const Stats = require('./models/stats');

app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());

const html = require('./controllers/html');
const api = require('./controllers/api');
html(app);
api(app,Stats);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))