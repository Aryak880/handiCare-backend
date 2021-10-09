const express = require('express');
const router = new express.Router()
const Volunteer = require('../models/VolunteerModel')
const auth = require('../middleware/authVolunteer')



// Create a new volunteer
//  public
router.post('/volunteer/signup', async (req, res) => {
    const volunteer = new Volunteer(req.body)

    try {
        await volunteer.save()
        const token = await volunteer.generateAuthToken()
        res.status(201).send({ volunteer, token })

    } catch (error) {
        res.status(400).send(error)
    }
})

// GET/login
// public
router.post('/volunteer/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const volunteer = await Volunteer.findByIdCredential(email, password)
        const token = await volunteer.generateAuthToken()

        res.status(200).send({ volunteer, token })

    } catch (error) {
        res.status(404).send()
    }
})


// GET/me
// private
router.get('/volunteer/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id)

        if (!volunteer)
            return res.status(404).send()

        res.status(302).send(volunteer)

    } catch (error) {
        res.status(500).send(error)
    }
})


// Endpoint for the volunteer logout
router.post('/volunteer/logout', auth, async (req, res) => {
    try {
        req.volunteer.tokens = req.volunteer.tokens.filter(token => token.token !== req.token)
        await req.volunteer.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})


// get/volunteers        developer
// // private
// router.get('/volunteers', auth, async (req, res) => {
//     res.send(req.volunteers)
// })


// update the volunteer information
router.patch('/volunteer/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'age', 'password', 'email', 'gender', 'instagram', 'facebook', 'helped']
    const isValidOpretion = updates.every(update => allowUpdates.includes(update))

    if(!isValidOpretion)
        return res.status(400).send({error: 'Invalid updates!'})

    try {
        updates.forEach(e => req.volunteer[e] = req.body[e])
        await req.volunteer.save()
        res.status(302).send(req.volunteer)
    } catch (e) {
        res.status(400).send(e)
    }
})


// POST/volunteer/logoutAll  
// It will delete all the tokens
router.post('/volunteer/logoutAll', auth, async (req, res) => {
    try {
        req.volunteer.tokens = []
        await req.volunteer.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// DELETE/volunteer/me
// delete the volunteer
router.delete('/volunteer/me', auth, async (req, res) => {
    try {
        await req.volunteer.remove()
        res.status(302).send(req.volunteer)
    } catch (e) {
        res.status(500).send(e)
    }
})


// For admin
router.get('/volunteers', auth, async(req, res) => {
    try {
        if(req.volunteer.isAdmin === false)
            throw new Error({error: "Invalid request"})

        const volunteer = await Volunteer.find({})
        res.status(201).send(volunteer)
    } catch (error) {
        res.status(400).send({error: "Invalid request"})
    }
})

// make any Volunteer to admin
router.patch('/volunteer/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        if(req.volunteer.isAdmin === false)
            throw new Error({error: "Invalid request"})

        let volunteer = await Volunteer.findById(_id)
        volunteer.isAdmin = !volunteer.isAdmin
        await volunteer.save()

        res.status(201).send(volunteer)
    } catch (error) {
        res.status(400).send({error: "Invalid request"})
    }
})

module.exports = router