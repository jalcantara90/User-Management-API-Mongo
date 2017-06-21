'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = process.env.SECRETKEY || 'Secret-Key-String';

exports.ensureAuth = function(req, res, next) {  //Export the method ensureAuth to verify if token is valid to execute functions 

    if (!req.headers.authorization) { 
        //If the request hasn't the Athorization header we send an error 
        return res.status(403).send({mesage: 'The request needs Authorization Header'});
    }
        //If the request have an Header Authorization, we clean the string of ' and " to avoid errors
    const token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        //If all is OK we make a decode of token
        var payload = jwt.decode(token, secret);

        if( payload.exp <= moment().unix() ) {
            //We check if token has expired 
            return res.status(401).send({mesage: 'The Token has expired please, request a new one'});
        }
    }catch(ex){
        //If the token isn't valid we send a message error 
        return res.status(403).send({mesage: 'The token is not valid'});
    }

    // If all is OK, se add the payload to user attribute of request
    req.user = payload;

    // Call the next middleware
    next();

};