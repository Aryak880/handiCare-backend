const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Help = require('../models/HelpModel');


const HandicapSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    age: {
        type: Number,
        require: true,
        trim: true,
        default: 0,
        validate(value){
            if(value < 0)
                throw new Error("Age must be greater then zero")
        }
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error("Email is not valid!")
        }
    },
    gender: {
        type: String,
        require: true
    },
    achievements: [
        {
            title: {
                type: String,
                trim: true
            },
            discription: {
                type: String,
                trim: true
            }
        }
    ],
    password: {
        type: String,
        minlength: 7,
        require: true,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password'))
                throw new Error('Password should not include password')
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}, {
    timestamps: true
})

HandicapSchema.virtual('help', {
    ref: 'Help',
    localField: '_id',
    foreignField: 'owner'
})

HandicapSchema.methods.toJSON = function(){
    const handicap = this
    const handicapObj = handicap.toObject()

    delete handicapObj.password
    delete handicapObj.tokens
    
    return handicapObj
}

HandicapSchema.statics.findByIdCredential = async (email, password) => {
    const handicap = await Handicap.findOne({email})

    if(!handicap)
        throw new Error({error: 'Unable to login'})

    const isMatch = await bcrypt.compare(password, handicap.password)
    // const isMatch = await (password === user.password)

    if(!isMatch)
        throw new Error({error: 'Unable to login'})
    
    // console.log(user)

    return handicap
}

// It will generate web token and store it to the user
HandicapSchema.methods.generateAuthToken = async function() {
    const handicap = this
    const token = await jwt.sign({ _id: handicap._id.toString()}, process.env.JWT)

    handicap.tokens = handicap.tokens.concat({token})
    await handicap.save()

    return token
}

// Hashing the plain password to the chiper text
HandicapSchema.pre('save', async function (next){
    const handicap = this

    if(handicap.isModified('password')){
        handicap.password = await bcrypt.hash(handicap.password, 8)
    }

    next()
})

// It will delete all the help post by the handicap
HandicapSchema.pre('remove', async function(next) {
    const handicap = this
    await Help.deleteMany({owner: handicap._id})

    next()
})

const Handicap = mongoose.model('Handicap', HandicapSchema)

module.exports = Handicap