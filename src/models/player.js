const mongoose = require('mongoose')


const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    longName: {
        type: String,
        unique: true,
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    overseas: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    pointsBreakup: {
        type: Object,
        default: {
            batting: 0,
            bowling: 0,
            fielding: 0,
            bonus: 0
        }
    }
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player