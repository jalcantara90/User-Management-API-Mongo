'use strict'

const express = require('express');
const UserController = require('../controllers/user');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty'); // librería que sirve enviar ficheros por http
const md_upload = multipart({ uploadDir: './uploads/users' })

api.post('/user', UserController.saveUser );
api.post('/login', UserController.loginUser)
api.put('/user/:id', md_auth.ensureAuth, UserController.updateUser );
api.delete('/user/:id', md_auth.ensureAuth, UserController.deleteUser );
api.put('/add-friend/:id', md_auth.ensureAuth, UserController.addFriend );
api.put('/remove-friend/:id', md_auth.ensureAuth, UserController.removeFriend );
api.get('/get-friends/:id',md_auth.ensureAuth, UserController.getFriends);
api.get('/users/:page?', UserController.getUsers );
api.post('/upload-image-user/:id/:background?', [md_auth.ensureAuth, md_upload] ,UserController.uploadImage );
api.get('/get-image-user/:imageFile' ,UserController.getImageFile );

module.exports = api;