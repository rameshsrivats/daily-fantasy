const express = require('express')

const auth = require('../middleware/auth')
// const { sendWelcomeEmail } = require('../emails/email')
const User = require('../models/user')

const router = new express.Router()

// Validate token and return role
router.get('/users/role', auth, async (req, res) => {
    res.send({ role: req.user.role })
})

// Handler for new user registration
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        // sendWelcomeEmail(user.email, user.username)
        const token = await user.generateAuthToken()
        res.status(201).send({ token })
    } catch (e) {
        res.status(400).send({error: 'Email already taken'}) 
    }
})

// Handler for first username
router.patch('/users/username', auth, async (req, res) => {
    const dupe = await User.findOne({ userLowerCase: req.body.username.toLowerCase() })
    if (dupe) {
        res.status(400).send({ error: 'Username already taken'})
    } else {
        req.user.username = req.body.username
        req.user.userLowerCase = req.body.username.toLowerCase()
        await req.user.save()
        res.status(201).send({ role: req.user.role })
    }
})  

// Handler for login
router.patch('/users/login', async (req, res) => {
    try {
        const user = await User.login(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ token, role: user.role })
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

// Handler for logout
router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch {
        res.status(500).send()
    }
})

// Handler for logout all
router.get('/users/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

// Handler for user summary
router.get('/users/summary', auth, async (req, res) => {
    res.send({username: req.user.username, matchPoints: req.user.matchPoints, rank: req.user.rank})
})

// Get fixtures in which user has a squad
router.get('/users/fixtures', auth, async (req,res) => {
    try {
        await req.user.populate( 'squads', 'fixture' ).execPopulate()
        res.send(req.user.squads)
    } catch (e) {
        res.status(400).send(e.message)
    }
})



module.exports = router
