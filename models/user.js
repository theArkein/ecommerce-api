var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require("@config/config.json")

const { Schema } = mongoose;

const schema = new Schema({
    email: { 
        type: String, 
        index: true, 
        unique: true, 
        sparse: true 
    },
    googleId: {
        type: Number,
        default: null
    },
    facebookId: {
        type: Number,
        default: null
    },
    password: { 
        type: String,
        default: null
    },
    wishlist: [{
        type: Schema.Types.ObjectId, 
        ref: 'Product'
    }],
    cartlist: [{
        product: {
            type: Schema.Types.ObjectId, 
            ref: 'Product'
        },
        quantity: {
            type: Schema.Types.Number,
            default: 1
        }
    }],
    profileDetails:{
        firstname: {
            type: Schema.Types.String,
            default: null
        },
        lastname: {
            type: Schema.Types.String,
            default: null
        },
        email: {
            type: Schema.Types.String,
            immutable: true
        },
        phone: {
            type: Schema.Types.Number,
            default: null
        },
        address: {
            type: Schema.Types.String,
            default: null
        },
        profilePicture: {
            type: Schema.Types.String,
            default: null
        },
        profilePictureExternal: {
            type: Schema.Types.String,
            default: null
        }
    },
    billingAddress:{

    },
    verified: {
        type: Schema.Types.Boolean,
        default: false
    },
    passwordResetOTP: {
        type: String,
        index: true,
        default: null,
        sparse: true,
    }
}, {timestamps: true});

schema.index({createdAt: 1}, {expireAfterSeconds: 5*60, partialFilterExpression : {verified: false}});

schema.pre('save', function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    var hash = bcrypt.hashSync(this.password, config.bcrypt.saltRounds)
    // override the cleartext password with the hashed one
    this.password = hash;
    next()
});


const User = mongoose.model('User', schema);
module.exports = User