'use strict'

const fs = require('fs'); // requerimos filesistem para poder trabajar con los ficheros del servidor
const path = require('path'); // requerimos path para poder trabajr con las rutas del servidor

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');

function pruebas (req, res) {
    res.status(200).send({ 
        message: 'Probando el controlador de usuario'
    });
}

const saveUser = (req, res) => {
    let user = new User(); // instanciamos el objeto user con el modelo correspondiente
    
    let params = req.body; // recogemos todas las variables que nos lleguen por post

    user.name = params.name;
    user.surname = params.surname;
    user.nickname = params.nickname;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'role_user';

    if( params.password ) {
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;

            if( user.name != null && user.nickname !=null && user.email != null ) {
                user.save( (err, userStored) => {
                    if (err) {
                        res.status(500).send({message: 'Request Error'});
                    }else {
                        if ( !userStored ) {
                            res.status(404).send({message: 'The user is void'});
                        }else {
                            res.status(200).send({ user: userStored });
                        }
                    }
                })
            }
        })
    }

}

module.exports = {
    pruebas,
    saveUser
}