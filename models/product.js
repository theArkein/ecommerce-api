var mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    date: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);