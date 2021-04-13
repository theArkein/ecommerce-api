var Vendor = require('../../models/vendor')
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
    console.log("Vendor Signin")
    let {username, password} = req.body
    
    let errors = validateSignIn(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    Vendor.findOne({username}).then(vendor=>{
        console.log(vendor)
        if(!vendor)
            return res.status(400).json({
                success: false,
                message: "No accounts with such id",
            })
        let isMatch = bcrypt.compareSync(password, vendor.password);
        if(!isMatch)
            return res.status(401).json({
                status: false,
                message: "Ceredentials did not match",
                errors: {}
            })

        var token = jwt.sign({ id: vendor._id, userType: 2 }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

        // var decoded = jwt.verify(token, config.jwt.SECRET)
        return res.status(200).json({
            status: true,
            message: "Successfully signedin",
            token: token,
            data: vendor
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
    console.log("Vendor Signup")
    let vendor = new Vendor(req.body)
    console.log(vendor)
    vendor.save().then((vendor)=>{
        return res.json({
            success: true,
            message: "Successfully Added",
            data: vendor
        })

    }).catch(err=>{
        res.json({
             status: false,
             message: err.message,
             errors: err.errors
        })
   })  
}

module.exports = {
    signin,
    signup,
}