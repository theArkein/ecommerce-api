var mongoose = require('mongoose')
const { Schema } = mongoose;

const mongoosePaginate = require('mongoose-paginate-v2');

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
    comments: [{
        type: Schema.Types.ObjectId, ref: 'Comment'
    }],
    publish: {
         type: Schema.Types.Boolean,
         default: true
    },
    status: {
        type: Schema.Types.Number,
        default: 1, // 1 pending , 2 approved, 3 suspended
        min: 1,
        max: 3
    },
    tags: {
        type: String
    }
}, {timestamps: true});

schema.index({"$**": "text"})
schema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', schema);

module.exports = Product