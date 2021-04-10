var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    details: {
          orderId: {type: String},
          totalProducts: {type: Number},
          totalCost: {type: Number},
          orderedDate: {type: Date, default: Date.now},
          userId: {type: Number}
    },
    products: [{
        productId: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number},
        unitPrice: {type: Number},
        totalPrice: {type: Number}
    }]
}, {timestamps: true});

const Order = mongoose.model('Order', schema);

module.exports = Order