var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, required: true, enum: ['admin', 'operator', 'client'], default: 'client'}
});

module.exports = mongoose.model('User', UserSchema);