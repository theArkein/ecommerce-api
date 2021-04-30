var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    shortname: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    sku: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    vendor: {
        type: Schema.Types.ObjectId, ref: 'Vendor',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    discountedPrice: {
        type: Number,
        default: this.price
    },
    stock: {
        type: Number,
        default: null,
        min: 0
    },
    viewCounts: {
        type: Number,
        default: 0
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