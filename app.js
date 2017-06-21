'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Routes load

const user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configure Headers

app.use(( (req, res, next)=> {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow' , 'GET, POST, OPTIONS, PUT, DELETE');

    next();
}));


// base routes

app.use('/api', user_routes);

module.exports = app;