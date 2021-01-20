var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        default: Date.now,
    },
    end_date: {
        type: Date,
    },
    super_user_id: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('schedule', scheduleSchema);