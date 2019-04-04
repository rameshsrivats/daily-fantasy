const mongoose = require('mongoose')


const teamSchema = new mongoose.Schema({
    name: {
        type: String
    },
    longName: {
        type: String
    }
})

const Team = mongoose.model('Team', teamSchema)

module.exports = Team