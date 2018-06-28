const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || process.argv[2] || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const html = require('./controllers/html')
html(app)

app.listen(PORT, () => `Listening on port ${PORT}`)