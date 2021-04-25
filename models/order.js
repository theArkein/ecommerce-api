var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    orderId: {type: String},
    totalProducts: {type: Number},
    totalCost: {type: Number},
    orderedDate: {type: Date, default: Date.now},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    vendor: {type: Schema.Types.ObjectId, ref: 'Vendor', required: true},
    products: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, required: true},
        unitCost: {type: Number, required: true},
        totalCost: {type: Number},
    }],
    billingDetails: {
        name: {type: String},
        email: {type: String},
        phone: {type: Number},
        address: {type: String},
        country: {type: String},
        postalCode: {type: Number}
    },
    shippingDetails: {
        name: {type: String},
        email: {type: String},
        phone: {type: Number},
        address: {type: String},
        country: {type: String},
        postalCode: {type: Number}
    },  
    status: {type: Number, default: 0},
}, {timestamps: true});

const Order = mongoose.model('Order', schema);

module.exports = Order