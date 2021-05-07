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
        default: null
    },
    subComments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]

}, {timestamps: true});

function autoPopulateSubs(next) {
    this
    .populate('subComments')
    .populate('commentor', 'profileDetails.firstname profileDetails.lastname')
    next();
}
  
schema
.pre('findOne', autoPopulateSubs)
.pre('find', autoPopulateSubs);
  

const Comment = mongoose.model('Comment', schema);

module.exports = Comment