const express = require('express')

const auth = require('../middleware/auth')
const User = require('../models/user')
const Fixture = require('../models/fixture')
const Team = require('../models/team')
const Player = require('../models/player')
const Squad = require('../models/squad')

const router = new express.Router()

router.get('/squads/:id/me', auth, async (req, res) => {
    const fixtureId = req.params.id
    try {
        const curSquad = await Squad.findOne({user: req.user._id, fixture: fixtureId})
        if (curSquad) {
            res.send(curSquad) 
        } else {
            res.send({empty: 'No squad created yet'})
        }
        
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.put('/squads/:id', auth, async (req,res) => {
    const fixtureId = req.params.id

    try {
        // Check lock-in time
        const fixture = await Fixture.findById(fixtureId)
        const lockIn = fixture.lockIn
        const now = Date.now()
        if (now > lockIn) {
            res.status(400).send({ message: 'Your squad could not be saved. The match is already locked.'})
        } else {
            // create newSquad object
            const newSquad = {
            user: req.user._id,
            fixture: fixtureId,
            squad: req.body
            }
            let curSquad = await Squad.findOne({user: req.user._id, fixture: fixtureId})
            if (curSquad) {
                await Squad.updateOne({ _id: curSquad._id}, newSquad)
            } else {
                curSquad = new Squad(newSquad)
                await curSquad.save()
            }
            res.status(201).send({ message: 'Your squad has been saved' })            
        }    
    } catch (e) {
        res.status(500).send({ message: 'Your squad could not be saved. ' + e.message })
    }
})




module.exports = router