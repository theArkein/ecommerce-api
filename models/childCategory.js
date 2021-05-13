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
         unique: true,
         index: true,
    },
    icon: {
         type: String
    },
    publish: {
          type: Boolean,
          default: true
     },
    parent: {
         type: Schema.Types.ObjectId, ref: 'SubCategory',
    },
    grandParent: {
          type: Schema.Types.ObjectId, ref: 'MainCategory',
     }
},{timestamps: true});

const ChildCategory = mongoose.model('ChildCategory', schema);
module.exports = ChildCategory
