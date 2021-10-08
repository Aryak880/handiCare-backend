const express = require('express');
const auth = require('../middleware/authHandicap')
const router = new express.Router()
const Help = require('../models/HelpModel')


// Create a new help    
router.post('/me/help', auth, async(req, res) => {
    const help = new Help({
        ...req.body,
        owner: req.handicap._id
    })

    try {
        await help.save()
        res.status(201).send(help)

    } catch (error) {
        res.status(400).send({error})
    }
})


// Fetch all the helps of a Handicap
// GET /helps
    router.get('/me/helps', auth, async (req, res) => {
        try {
            // const match = {}
            
            await req.handicap.populate({
                path: 'help'
            }).execPopulate()

            res.status(200).send(req.handicap.help)
        } catch (error) {
            res.status(404).send(e)
        }
    })



// GET/heps
// It will fetch all the helps in database
    router.get('/helps', async (req, res) => {
        try {
            const helps = await Help.find({})
            res.status(200).send(helps)
        } catch (e) {
            res.status(404).send(e)
        }
    })

// DELETE/help/:id
// It will delete a help
    router.delete('/me/help/:id', auth, async (req, res) => {
        try {
            const help = await Help.findByIdAndDelete(req.params.id)
            res.status(200).send(help)
        } catch (error) {
            res.status(400).send({error})
        }
    })


// PATCH/me/help/:id
// It will update the user help
    router.patch('/me/help/:id', auth, async (req, res) => {
        try {
            const updates = Object.keys(req.body) 
            const allowUpdates = ['discription', 'location', 'category']
            const isValidOperation = updates.every(update => allowUpdates.includes(update))
            
            if(!isValidOperation)
                return res.status(400).send({error: "Invalid Operation"})

                const help = await Help.updateOne({_id: req.params.id}, { ...req.body })
        
            res.status(200).send(help)

        } catch (error) {
            res.status(400).send({error: "Not Updated!"})
        }
    })

// GET/read-help/:id
    router.get('/read-help/:id', async(req, res) => {
        try {
            const help = await Help.findById(req.params.id)

            res.status(200).send(help)
        } catch (e) {
            res.status(404).send({error: "help is not found!"})
        }
    })


module.exports = router