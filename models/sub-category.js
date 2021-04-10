var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    name: {
         type: String,
         required: true,
         unique: true,
    },
    slug: {
         type: String,
         required: true,
         unique: true
    },
    publish: {
          type: Boolean,
          default: true
     },
    parent: {
         type: Schema.Types.ObjectId, ref: 'MainCategory',
    },
    children: [{
         type: Schema.Types.ObjectId, ref: 'ChildCategory'
     }],
}, {timestamps: true});

const SubCategory = mongoose.model('SubCategory', schema);
module.exports = SubCategory
