var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    comment: {
        type: Schema.Types.String,
        require: true
    },
    commentor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: false
    },
    subComments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]

}, {timestamps: true});

const Comment = mongoose.model('Comment', schema);

module.exports = Comment