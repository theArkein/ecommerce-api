const { required } = require('joi');
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
        default: null
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
    stock: {
        type: Number,
        default: null,
        min: 0
    },
    viewCounts: {
        type: Number,
        default: 0
    },
    image: {
        type: Schema.Types.String,
        required: true
    },
    gallery: [],
    brand: {
        type: Schema.Types.String
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
    reviews: [{
        type: Schema.Types.ObjectId, ref: 'Review'
    }],
    publish: {
         type: Boolean,
         default: true
    },
    tags: {
        type: String
    }
}, {timestamps: true});

schema.index({"$**": "text"})

const Product = mongoose.model('Product', schema);

module.exports = Product