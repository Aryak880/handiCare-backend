const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const validator = require('validator');


const VolunteerSchema = mongoose.Schema({
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
    instagram: {
        type: String,
        trim: true,
    },
    facebook: {
        type: String,
        trim: true,
    },
    helped:[
        {
            name: {
                type: String,
                trim: true,
            },
            description: {
                type: String,
                trim: true,
            },
            handicapId: {
                type: mongoose.Schema.Types.ObjectId,
                trim: true
            }
        }
    ],
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

VolunteerSchema.methods.toJSON = function(){
    const volunteer = this
    const volunteerObj = volunteer.toObject()

    delete volunteerObj.password
    delete volunteerObj.tokens
    
    return volunteerObj
}

VolunteerSchema.statics.findByIdCredential = async (email, password) => {
    const volunteer = await Volunteer.findOne({email})

    if(!volunteer)
        throw new Error({error: 'Unable to login'})

    const isMatch = await bcrypt.compare(password, volunteer.password)
    // const isMatch = await (password === volunteer.password)

    if(!isMatch)
        throw new Error({error: 'Unable to login'})
    
    // console.log(volunteer)

    return volunteer
}

// It will generate web token and store it to the user
VolunteerSchema.methods.generateAuthToken = async function() {
    const volunteer = this
    const token = await jwt.sign({ _id: volunteer._id.toString()}, process.env.JWT)

    volunteer.tokens = volunteer.tokens.concat({token})
    await volunteer.save()

    return token
}

// Hashing the plain password to the chiper text
VolunteerSchema.pre('save', async function (next){
    const volunteer = this

    if(volunteer.isModified('password')){
        volunteer.password = await bcrypt.hash(volunteer.password, 8)
    }

    next()
})


const Volunteer = mongoose.model('Volunteer', VolunteerSchema)

module.exports = Volunteer