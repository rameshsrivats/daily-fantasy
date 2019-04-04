const mongoose = require('mongoose')

const squadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fixture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fixture'        
    },
    squad: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        },
        batStar: {
            type: Boolean,
            default: false
        },
        bowlStar: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
})
 




const Squad = mongoose.model('Squad', squadSchema)

module.exports = Squad