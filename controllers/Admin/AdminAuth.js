var Admin = require('../../models/admin')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var Joi = require('joi')
const config = require("../../config/config.json")

const validateSignIn = (data)=>{
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
        .required()
    
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const signin = (req, res)=>{
    console.log("Admin Signin")
    let {username, password} = req.body
    
    let errors = validateSignIn(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    Admin.findOne({username}).then(admin=>{
        let isMatch = bcrypt.compareSync(password, admin.password);
        if(!isMatch)
            return res.status(401).json({
                status: false,
                message: "Ceredentials did not match",
                errors: {}
            })

        var token = jwt.sign({ id: admin._id }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

        // var decoded = jwt.verify(token, config.jwt.SECRET)
        return res.status(200).json({
            status: true,
            message: "Successfully signedin",
            token: token,
            data: admin
        })
    }).catch(err=>{
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: err
        })
    })

}

const signup = (req, res)=>{
    console.log("Admin Signup")
    let admin = new Admin(req.body)
    admin.save().then((admin)=>{
        return res.json({
            success: true,
            message: "Successfully Added",
            data: admin
        })

    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            errors: err
        })
    })  
}

module.exports = {
    signin,
    signup,
}