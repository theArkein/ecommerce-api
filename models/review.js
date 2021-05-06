var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    rating: {
        type: Number,
        max: 5,
        min: 1,
        require: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    review: {
        type: Schema.Types.String,
        require: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }

}, {timestamps: true});

const Review = mongoose.model('Review', schema);

module.exports = Review