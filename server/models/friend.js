const mongoose = require('mongoose')

const friendSchema = mongoose.Schema({
    from: {
        type: String,
        require: true
    },
    to: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('friend', friendSchema)
