const express = require('express')

const auth = require('../middleware/auth')
const User = require('../models/user')
const Fixture = require('../models/fixture')
const Team = require('../models/team')
const Player = require('../models/player')
const Squad = require('../models/squad')

const router = new express.Router()

// Get all fixtures (admin function)
router.get('/fixtures', async (req, res) => {
    try {
        const allFixtures = await Fixture.find().populate('team1').populate('team2').exec()
        console.log('length ', allFixtures.length)
        allFixtures.sort( (a,b) => a.matchNumber - b.matchNumber )
        res.send(allFixtures)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Gets upcoming fixtures. Also figures if user has a squad or not
router.get('/fixtures/upcoming', auth, async (req, res) => {
    const now = Date.now()
    try {
        const upcoming = await Fixture.getUpcoming(now)
        upcoming.sort( (a,b) => a.matchNumber - b.matchNumber )
        res.send({upcoming})
    } catch (e) {
        return res.status(400).send({error: 'Could not fetch upcoming'})
    }
})

router.get('/fixtures/:id/players', auth, async (req, res) => {
    const fixtureID = req.params.id
    try {
        const fixture = await Fixture.findById(fixtureID)
        const roster = await Player.find({ $or: [{team: fixture.team1}, {team: fixture.team2} ]}).populate('team').exec()
        res.send(roster)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }  
})

router.get('/fixture/:id/users', auth, async (req, res) => {
    const fixtureId = req.params.id
    try {
        const fixture = await Fixture.findById(fixtureId)
        await fixture.populate({
            path: 'squads',
            match: { user: req.user.id }
        }).execPopulate()
        res.send(fixture.squads)
    } catch (e) {
        res.status(400).send(e.message)
    }
    
})

module.exports = router