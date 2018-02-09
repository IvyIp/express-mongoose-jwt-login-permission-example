var User = require("../models/User");
var Token = require("../models/Token");
var tokenController = require("./TokenController");
var mongoose = require('mongoose');

var userController = {};

userController.register = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    new Promise(function(resolve, reject){
        if ( username && password ) { resolve(); } else { reject('invalid post data') }
    }).then(function(){
        return new Promise(function (resolve, reject){
            User.create({ username: username, password: password, role: role }, function (err, user) {
                if (err) reject(err);
                resolve(user._id);
            })
        })
    }).then(function(userId){
        tokenController.mount(userId, function(result){
            if (result === false){
                res.sendStatus(500)
            }else {
                res.json({token: result})
            }
        });
    }).catch(function(err){
        console.log(err);
        res.sendStatus(400)
    })
};

userController.login = function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ 'username': username }, function (err, user) {
        if (user && (user.password === password)) {
            tokenController.mount(user._id, function(result){
                if (result === false){
                    res.sendStatus(500)
                }else {
                    res.json({token: result})
                }
            });
        } else {
            res.sendStatus(401)
        }
    });
};

userController.logout = function(req, res){
    var userId = req.user_id;
    Token.remove({ '_user': mongoose.Types.ObjectId(userId) }, function (err) {
        if (err){
            res.sendStatus(400)
        }else {
            res.sendStatus(200)
        }
    });
};

userController.private = function (req, res){
    var userId = req.user_id;
    User.findById(userId, function (err, user) {
        if (user) {
            res.send(`some private information. Username: ${user.username}`);
        } else {
            res.sendStatus(500)
        }
    });
};

userController.admin = function (req, res){
    res.send('this can be viewed by user with admin role only');
};

module.exports = userController;
