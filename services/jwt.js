'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = process.env.SECRETKEY || 'Secret-Key-String';

exports.createToken = function (user) {
    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        avatarImage: user.avatarImage,
        backgroundImage: user.avatarImage,
        bio: user.bio,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
};