var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require("../config/config.json")

const { Schema } = mongoose;

const schema = new Schema({
    email: { 
        type: String, 
        index: true, 
        unique: true, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    orders: [{
        type: Schema.Types.ObjectId, 
        ref: 'Order'
    }],
    wishlist: [{
        type: Schema.Types.ObjectId, 
        ref: 'Product'
    }],
    cartList: [{
        type: Schema.Types.ObjectId, 
        ref: 'Product'
    }],
    date: { 
        type: Date, 
        default: Date.now 
    },
});

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