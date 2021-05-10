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
    products: [{
        type: Schema.Types.ObjectId, 
        ref: 'Product'
    }],
    orders: [{
        type: Schema.Types.ObjectId, 
        ref: 'Order'
    }],
    accountStatus: {
        type: Number,
        min: 0, // 0 Not verified, 1 verified , 2 approved, 3 suspended
        max: 4,
        default: 0
    }
}, {timestamps: true});

schema.index({createdAt: 1}, {expireAfterSeconds: 5*60, partialFilterExpression : {accountStatus: 0}});

schema.pre('save', function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    var hash = bcrypt.hashSync(this.password, config.bcrypt.saltRounds)
    this.password = hash;
    next()
});

const Vendor = mongoose.model('Vendor', schema);

module.exports = Vendor