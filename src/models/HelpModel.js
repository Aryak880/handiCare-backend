const mongoose = require("mongoose")

const HelpSchema = mongoose.Schema({
    discription: {
        type: String,
        require: true,
        trim: true
    },
    location: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    category: {
        type: String,
        require: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Handicap'
    }
}, {
    timestamps: true
})

const Help = mongoose.model('Help', HelpSchema)

module.exports = Help