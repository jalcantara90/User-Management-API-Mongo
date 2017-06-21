'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3050;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/users-management', (err, res) => {
    if(err) {
        throw err;
    }else {
        console.log( "la conexión a la base de datos está funcionando correctamente..." );

        app.listen(port, function(){
            console.log('Servidor del API Rest escuchando http://localhost:' + port);
        })
    }
});