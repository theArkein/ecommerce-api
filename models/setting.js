var mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
        type: String,
        content: {}
});

const Setting = mongoose.model('Setting', schema);
module.exports = Setting