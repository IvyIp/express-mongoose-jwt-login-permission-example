var User = require("../models/User");
var Token = require("../models/Token");
var tokenController = require("./TokenController");
var mongoose = require('mongoose');

var userController = {};

userController.register = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if ( username && password ){
        User.create({ username: username, password: password }, function (err, user) {
            if (err) {
                res.sendStatus(400)
            }else{
                tokenController.mount(user._id, function(result){
                    if (result === false){
                        res.sendStatus(500)
                    }else {
                        res.json({token: result})
                    }
                });
            }
        })
    }else{
        res.sendStatus(400);
    }
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

userController.private =function (req, res){
    var userId = req.user_id;
    User.findById(userId, function (err, user) {
        if (user) {
            res.send(`some private information. Username: ${user.username}`);
        } else {
            res.sendStatus(500)
        }
    });
};

module.exports = userController;
