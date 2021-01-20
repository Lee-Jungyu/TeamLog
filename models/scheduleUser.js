var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheduleUserSchema = new Schema({
    schedule_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    accepted: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('scheduleUser', scheduleUserSchema);