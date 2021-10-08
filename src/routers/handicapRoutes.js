const express = require('express');
const router = new express.Router()
const Handicap = require('../models/HandicapModel.js')
const auth = require('../middleware/authHandicap')



// Create a new handicap
//  public
router.post('/handicap/signup', async (req, res) => {
    const handicap = new Handicap(req.body)

    try {
        await handicap.save()
        const token = await handicap.generateAuthToken()
        res.status(201).send({ handicap, token })

    } catch (error) {
        res.status(400).send(error)
    }
})

// GET/login
// public
router.post('/handicap/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const handicap = await Handicap.findByIdCredential(email, password)
        const token = await handicap.generateAuthToken()

        res.status(200).send({ handicap, token })

    } catch (error) {
        res.status(404).send()
    }
})


// GET/me
// private
router.get('/handicap/:id', async (req, res) => {
    try {
        const handicap = await Handicap.findById(req.params.id)

        if (!handicap)
            return res.status(404).send()

        res.status(302).send(handicap)

    } catch (error) {
        res.status(500).send(error)
    }
})

// Endpoint for the handicap logout
router.post('/handicap/logout', auth, async (req, res) => {
    try {
        req.handicap.tokens = req.handicap.tokens.filter(token => token.token !== req.token)
        await req.handicap.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})


// get/handicap        developer
// private
router.get('/handicap', auth, async (req, res) => {
    res.send(req.handicap)
})


// update the handicap information
router.patch('/handicap/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'age', 'password', 'email', 'gender']
    const isValidOpretion = updates.every(update => allowUpdates.includes(update))

    if(!isValidOpretion)
        return res.status(400).send({error: 'Invalid updates!'})

    try {
        updates.forEach(e => req.handicap[e] = req.body[e])
        await req.handicap.save()
        res.status(302).send(req.handicap)
    } catch (e) {
        res.status(400).send(e)
    }
})


// POST/handicap/logoutAll  
// It will delete all the tokens
router.post('/handicap/logoutAll', auth, async (req, res) => {
    try {
        req.handicap.tokens = []
        await req.handicap.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// DELETE/handicap/me
// delete the handicap
router.delete('/handicap/me', auth, async (req, res) => {
    try {
        await req.handicap.remove()
        res.status(302).send(req.handicap)
    } catch (e) {
        res.status(500).send(e)
    }
})


// For admin
router.get('/handicapes', auth, async(req, res) => {
    try {
        if(req.handicap.isAdmin === false)
            throw new Error({error: "Invalid request"})

        const handicap = await Handicap.find({})
        res.status(201).send(handicap)
    } catch (error) {
        res.status(400).send({error: "Invalid request"})
    }
})

// make any handicap to admin
router.patch('/handicapes/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        if(req.handicap.isAdmin === false)
            throw new Error({error: "Invalid request"})

        let handicap = await Handicap.findById(_id)
        handicap.isAdmin = !handicap.isAdmin
        await handicap.save()

        res.status(201).send(handicap)
    } catch (error) {
        res.status(400).send({error: "Invalid request"})
    }
})

module.exports = router