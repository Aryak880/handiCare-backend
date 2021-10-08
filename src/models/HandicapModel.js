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
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    
    return userObj
}

HandicapSchema.statics.findByIdCredential = async (email, password) => {
    const user = await User.findOne({email})

    if(!user)
        throw new Error({error: 'Unable to login'})

    const isMatch = await bcrypt.compare(password, user.password)
    // const isMatch = await (password === user.password)

    if(!isMatch)
        throw new Error({error: 'Unable to login'})
    
    // console.log(user)

    return user
}

// It will generate web token and store it to the user
HandicapSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString()}, process.env.JWT)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

// Hashing the plain password to the chiper text
HandicapSchema.pre('save', async function (next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// It will delete all the story post by the user
HandicapSchema.pre('remove', async function(next) {
    const user = this
    await Help.deleteMany({owner: user._id})

    next()
})

const User = mongoose.model('Handicap', HandicapSchema)

module.exports = User