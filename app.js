const express = require('express');
const app = express();
const cors = require('cors');
require('./projects/linksharing/config/db'); 

const linksharingApp = require('./projects/linksharing/linksharing.app.js');

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/linksharing', linksharingApp);

app.listen(2000, () => {
    console.log('Main app listening on port 2000');
});