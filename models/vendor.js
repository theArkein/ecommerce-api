var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require("@config/config.json")


const { Schema } = mongoose;

const schema = new Schema({
    email: { 
        type: String, 
        index: true, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        index: true,
        required: true 
    },
    name: {
        type: String, 
        required: true 
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
   },
    products: [{
        type: Schema.Types.ObjectId, 
        ref: 'Product'
    }],
    orders: [{
        type: Schema.Types.ObjectId, 
        ref: 'Order'
    }],
    date: {
        type: Date, 
        default: Date.now 
    },
}, {timestamps: true});

schema.pre('save', function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    var hash = bcrypt.hashSync(this.password, config.bcrypt.saltRounds)
    this.password = hash;
    next()
});


const Vendor = mongoose.model('Vendor', schema);
module.exports = Vendor