var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema } = mongoose;

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    // email: { type: String, index: true, unique: true, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

schema.pre('save', function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    var hash = bcrypt.hashSync(this.password, config.bcrypt.SALT_WORK_FACTOR)
    // override the cleartext password with the hashed one
    this.password = hash;
    next()
});


const Admin = mongoose.model('Admin', schema);
module.exports = Admin