const mongoose = require('mongoose')

const fixtureSchema = new mongoose.Schema({
    matchNumber: {
        type: Number
    },
    team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    lockIn: {
        type: Date
    },
    status: {
        type: String,
        default: 'Upcoming'
    },
    scores: [{
        player: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player'
            },
            points: {
                type: Number
            },
            breakdown: {
                batting: {
                    type: Number
                },
                bowling: {
                    type: Number
                },
                fielding: {
                    type: Number
                },
                bonus: {
                    type: Number
                }
            }
        }
    }]
}, {
    timestamps: true
})

fixtureSchema.virtual('squads', {
    ref: 'Squad',
    localField: '_id',
    foreignField: 'fixture'
})

fixtureSchema.statics.getUpcoming = async (time) => {
    const upcoming = await Fixture.find({lockIn: {$gt: time}}).select('-scores').populate('team1').populate('team2').exec()
    return upcoming
}

fixtureSchema.statics.getLastLocked = async (time) => {
    const lockedFixtures = await Fixture.find({lockIn: {$lt: time}}).select('-scores').populate('team1').populate('team2').exec()
    const lastLocked = lockedFixtures.sort((a, b) => b.lockIn - a.lockIn)[0]
    return lastLocked
}

fixtureSchema
 


const Fixture = mongoose.model('Fixture', fixtureSchema)

module.exports = Fixture 