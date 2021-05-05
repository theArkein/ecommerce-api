var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    label: {
        type: Schema.Types.String,
        require: true,
    },
    fullname: {
        type: Schema.Types.String,
        require: true,
        default: null
    },
    phone: {
        type: Schema.Types.Number,
        default: null,
        require: true
    },
    region: {
        type: Schema.Types.String,
        default: null
    },
    city: {
        type: Schema.Types.String,
        default: null,
        require: true,
    },
    zone: {
        type: Schema.Types.String,
        default: null
    },
    address: {
        type: Schema.Types.String,
        default: null,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User',
        default: null
    },
    isDefault: {
        type: Schema.Types.Boolean,
        default: false,
    }
}, {timestamps: true});

const ShippingAddress = mongoose.model('ShippingAddress', schema);
module.exports = ShippingAddress
