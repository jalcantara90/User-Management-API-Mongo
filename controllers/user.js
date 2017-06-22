'use strict'

const fs = require('fs'); // requerimos filesistem para poder trabajar con los ficheros del servidor
const path = require('path'); // requerimos path para poder trabajr con las rutas del servidor

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');
const mongoosePaginate = require('mongoose-pagination');

const getUsers = (req, res) => {

    let page;
    let pages;
    let itemsPerPage = 50;
    
    if (req.params.page) {
        page = req.params.page;
    }else {
        page = 1;
    }

    User.find().sort('name').paginate( page, itemsPerPage, (err, users , totals) => {
        if (err) {
            res.status(500).send({ message: 'Request Error' });
        }else {
            if (!users) {
                res.status(404).send({ message: 'Users not found'});
            }else {
                pages = totals/ itemsPerPage;

                if (pages < 1) {
                    pages = 1;
                } 

                res.status(200).send({
                    total_items: totals,
                    total_pages: pages,
                    users
                })
            }
        }
    })

}

const saveUser = (req, res) => {
    let user = new User(); // instanciamos el objeto user con el modelo correspondiente
    
    let params = req.body; // recogemos todas las variables que nos lleguen por post

    user.name = params.name;
    user.nickname = params.nickname;
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

const loginUser = (req, res) => {

    let params = req.body;

    let email = params.email;
    let password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({message: 'Request Error'})
        }else {
            if (!user) {
                res.status(404).send({ message: 'The User does not exist '})
            }else {              
                // check if the password is the same of our database
                bcrypt.compare(password, user.password, (err, check)=>{
                    // if the passwords is valid
                    if (check) {
                        // if the param gethash is send in request we generate the token
                        if (params.gethash) {
                            res.status(200).send({ token: jwt.createToken(user) });
                        }else {
                            // if the gethash is not set we return a user information
                            res.status(200).send({ user });
                        }
                    }else { // If password not match
                        res.status(404).send({message: 'The user can not login '});
                    }
                });
            }
        }
    })
}

const updateUser = (req, res) => {

    let userId = req.params.id
    let update = req.body;

    if ( userId != req.user.sub ) {
       return  res.status(500).send({message: 'Have not permission'});
    }

    User.findByIdAndUpdate( userId, update , (err, userUpdated) => {
        if (err) {
            res.status(500).send({message: 'Request Error' });
        }else {
            if ( !userUpdated ) {
                res.status(404).send({ message: 'User not found'});
            }else {
                res.status(200).send({ user: userUpdated })
            }
        }
    })  
}

const deleteUser = (req, res) => {

    let userId = req.params.id;

    if( !userId ) {
        res.status(500).send({message: 'The request needs an user id to delete register'})
    }else {
        User.findByIdAndRemove( userId , (err, userDeleted) => {
            if ( err ) {
                res.status(500).send({ message: 'Request Error'})
            }else {
                if(!userDeleted) {
                    res.status(404).send({ message: 'User not found'});
                }else {
                    res.status(200).send({ user: userDeleted})
                }
            }
        });
    }
}

const addFriend = (req, res) => {

    let userId = req.params.id;
    let params = req.body;
    let friend = params.friend;

    User.findByIdAndUpdate( userId,{$push:{friends: friend}} ,
        {safe: true, upsert: true, new : true},
        (err, friendsUpdated) => {
            if(err) {
                res.status(500).send({message: 'Request Error'});
            }else {
                if( !friendsUpdated ) {
                    res.status(404).send({ message: 'User not found'});
                }else {
                    res.status(200).send({ user: friendsUpdated });
                }
            }   
        }
    );
}

const removeFriend = (req, res) => {

    let userId = req.params.id;
    let params = req.body;
    let friend = params.friend;

    User.findByIdAndUpdate( userId,{$pull:{friends: friend}} ,
        {safe: true, upsert: true, new : true},
        (err, friendsRemoved) => {
            if(err) {
                res.status(500).send({message: 'Request Error'});
            }else {
                if( !friendsRemoved ) {
                    res.status(404).send({ message: 'User not found'});
                }else {
                    res.status(200).send({ user: friendsRemoved });
                }
            }   
        }
    );
}

const getFriends = (req, res) => {

    let userId = req.params.id;

    User.findOne({ _id: userId }).populate({ 
            path: 'friends',
            model: 'User',
            populate: {
                path: 'friends',
                model: 'User',
            }
        }).exec( (err, friends) => {
        if( err ) {
            res.status(500).send({ message: 'Request Error'});
        }else {
            if ( !friends ){
                res.status(404).send('Not found User');
            }else {
                res.status(200).send({ friends })
            }
        }
    })
}

const uploadImage = (req, res) => {

    let imageAtributte;

   

    let userId = req.params.id;
    let file_name = 'Not Upload';

    if(req.files) {
        let file_path = req.files.image.path;

        let file_split = file_path.split('/');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
             if (req.params.background) {

                User.findByIdAndUpdate( userId, { backgroundImage: file_name } , (err, userUpdated) => {

                    if (!userUpdated) {
                        res.status(404).send({ message: 'User not updated'});
                    }else {
                        res.status(200).send({ image: file_name, user: userUpdated });
                    }
                })
            }else {
                User.findByIdAndUpdate( userId, { avatarImage: file_name } , (err, userUpdated) => {

                    if (!userUpdated) {
                        res.status(404).send({ message: 'User not updated'});
                    }else {
                        res.status(200).send({ image: file_name, user: userUpdated });
                    }
                })
            }
            

        }else {
            res.status(200).send({ message: 'Wrong extension file'});
        }

    }else{
        res.status(200).send({ message: 'The image does not upload'});
    }
}

const getImageFile = (req, res) =>{
    let imageFile = req.params.imageFile;
    let path_file = './uploads/users/' + imageFile;

    fs.exists( path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve( path_file ))
        }else {
            res.status(200).send({ message: 'The image does not exist'});
        }
    })
}


module.exports = {
    getUsers,
    saveUser,
    updateUser,
    loginUser,
    deleteUser,
    addFriend,
    removeFriend,
    getFriends,
    uploadImage,
    getImageFile
}

