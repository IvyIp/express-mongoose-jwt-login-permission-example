var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true},
    token: { type: String, required: true}
});

module.exports = mongoose.model('Token', TokenSchema);