const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    id: {
        type: String, // 중복되면 안됨... 처리 요망
        require: true
    },
    pw: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
}, {
    versionKey: false
});
module.exports = mongoose.model('account', accountSchema)
