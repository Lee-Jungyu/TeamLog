var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userFriendSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    friend_id: {
        type: String,
        required: true,
    },
    accepted: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('userFriend', userFriendSchema);