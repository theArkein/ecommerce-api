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
    icon: {
         type: String,
         required: true
    },
    publish: {
         type: Boolean,
         default: true
    },
    children: [{
         type: Schema.Types.ObjectId, ref: 'SubCategory'
     }]
}, {timestamps: true});

const MainCategory = mongoose.model('MainCategory', schema);
module.exports = MainCategory
