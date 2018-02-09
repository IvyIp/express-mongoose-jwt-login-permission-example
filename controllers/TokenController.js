var mongoose = require("mongoose");
var Token = require("../models/Token");
var User = require("../models/User");
var jwt = require('jsonwebtoken');
var config = require("../config");

var tokenController = {};

tokenController.mount = function(userId, callback) {
    var token = jwt.sign({
        id: userId
    }, config.jwt.secret, { expiresIn: config.jwt.expireTime });   // expired after one hour

    Token.findOneAndUpdate(
        {_user: userId},
        {token: token},
        {upsert: true, new: true, setDefaultsOnInsert: true},
        function (err) {
            if (err){
                callback(false)
            }else{
                callback(token)
            }
        }
    )
};

tokenController.verify = function (permissions) {
    return function (req, res, next) {
        var username = req.header('x-user');
        var token = req.header('x-jwt');

        new Promise(function (resolve, reject) {
            // check fields exist
            if (username && token) {
                resolve()
            } else {
                reject()
            }
        }).then(function () {
            // verify jwt format
            return new Promise(function (resolve, reject) {
                jwt.verify(token, config.jwt.secret, function (err, decoded) {
                    if (err) {
                        reject();
                    } else {
                        resolve(decoded.id);
                    }
                })
            })
        }).then(function (decodedUserId) {
            // check user id decode from token is valid
            return new Promise(function (resolve, reject) {
                User.findById(decodedUserId, function (err, user) {
                    if (user && (user.username === username)) {
                        resolve(user)
                    } else {
                        reject()
                    }
                });
            })
        }).then(function (user) {
            // check permission
            return new Promise(function (resolve, reject) {
                if (typeof (permissions) === 'undefined') resolve(user._id);
                if (permissions.includes(user.role)) {
                    resolve(user._id)
                } else {
                    reject()
                }
            })
        }).then(function (decodedUserId) {
            // check if the token is unique
            return new Promise(function (resolve, reject) {
                Token.findOne({'token': token}, function (err, record) {
                    if (record && (record._user.toString() === decodedUserId.toString())) {
                        resolve(decodedUserId)
                    } else {
                        reject()
                    }
                });
            })
        }).then(function (decodedUserId) {
            req.user_id = decodedUserId;
            next();
        }).catch(function () {
            res.sendStatus(401);
        })
    }
};

module.exports = tokenController;
