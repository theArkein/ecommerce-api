var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require("@config/config.json")
const ADMIN_ROLES = require('@config/adminRoles.json')
const ADMIN_PERMISSIONS = require('@config/adminPermissions.json')
const PERMITTED_ENTITIES = require('@config/permittedEntities.json')

const { Schema } = mongoose;

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    adminRole: {
        type: String,
        required: true,
        enum: ADMIN_ROLES,
        default: 'ADMIN'
    },
    adminPermissions: {
        type: [{
            type: String,
            enum: ADMIN_PERMISSIONS,
        }]
    },
    permittedEntities:{
        type: [{
            type: String,
            enum: PERMITTED_ENTITIES,
        }]
    }
},{timestamps: true});

schema.pre('save', function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    var hash = bcrypt.hashSync(this.password, config.bcrypt.saltRounds)
    // override the cleartext password with the hashed one
    this.password = hash;
    next()
});


const Admin = mongoose.model('Admin', schema);
module.exports = Admin