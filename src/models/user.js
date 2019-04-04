const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    username: {
        type: String,
        trim: true,
        default: ''
    },
    userLowerCase: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    matchPoints: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    },
    history: [{
        match: {
            type: String
        },
        points: {
            type: Number
        },
        matchPts: {
            type: Number
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Define a virtual for squads
userSchema.virtual('squads', {
    ref: 'Squad',
    localField: '_id',
    foreignField: 'user'
})

// Control what data is passed back to client in user object
userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.email
    delete userObject.password
    delete userObject.userLowerCase
    delete userObject.tokens

    return userObject
}

// Generate auth token
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat([{token}])
    await this.save()
    return token
}

// Delete auth token on logout
userSchema.methods.deleteAuthToken = async function (authToken) {
    const index = this.tokens.findIndex((token) => {
        token === authToken
    })
    this.tokens.splice(index, 1)
    await this.save()
}

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

// Find a user by email & password
userSchema.statics.login = async (email, password) => {
    const user = await User.findOne({email: email})
    if (!user) {
        throw new Error('Email not found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid password')
    }
    return user
}

const User = new mongoose.model('User', userSchema)

module.exports = User