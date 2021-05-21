const { required } = require('joi');
var mongoose = require('mongoose')

const { Schema } = mongoose;

const schema = new Schema({
    firstname: {
        type: Schema.Types.String,
        required: true
    },
    lastname: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    contact: {
        type: Schema.Types.String,
        required: true
    },
    product: {
        type: Schema.Types.String,
        required: true
    },
    image: {
        type: Schema.Types.String
    },
    imageLink: {
        type: Schema.Types.String
    },
    expectedDeliveryDays: {type: Number},
    productDescription: {
        type: Schema.Types.String,
        required: true
    },
    enquiry: {
        type: Schema.Types.String,
        required: true
    },
    enquiredDate: {type: Date, default: Date.now}
}, {timestamps: true});

const ProductEnquiry = mongoose.model('ProductEnquiry', schema);
module.exports = ProductEnquiry