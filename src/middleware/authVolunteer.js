const Volunteer = require('../models/VolunteerModel')
const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT)
        const volunteer = await Volunteer.findOne({_id: decoded._id, 'tokens.token': token})

        if(!volunteer)
            throw new Error()

        req.token = token
        req.volunteer = volunteer

        next()

    } catch (e) {
        res.status(404).send({error: 'Authenticate please'})
    }
}

module.exports = auth