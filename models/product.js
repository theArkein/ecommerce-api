var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
    },
    sku: {
        type: String,
    },
    vendor: {
        type: Schema.Types.ObjectId, ref: 'Vendor',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: null,
        min: 0
    },
    images: {
        featured: {
            path: String,
            link: String
        },
        gallery: {
            type: Schema.Types.Mixed
        }
    },
    variants: {
        type: Schema.Types.Mixed
    },
    mainCategory: {
        type: Schema.Types.ObjectId, ref: 'MainCategory',
        required: true
    },
    subCategory: {
        type: Schema.Types.ObjectId, ref: 'SubCategory',
        required: true
    },
    childCategory: {
        type: Schema.Types.ObjectId, ref: 'ChildCategory',
        required: true
    },
    publish: {
         type: Boolean,
         default: true
    },
    status: {
        type: Number,
        default: 1,
        max: 3,
        min: 1,
   }
}, {timestamps: true});

const Product = mongoose.model('Product', schema);

module.exports = Product