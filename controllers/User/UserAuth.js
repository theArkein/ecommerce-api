var User = require('../../models/user')
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
    console.log("User Signin")
    let {username, password} = req.body
    
    let errors = validateSignIn(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    User.findOne({username}).then(user=>{
        console.log(user)
        if(!user)
            return res.status(400).json({
                success: false,
                message: "No accounts with such id",
            })
        let isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch)
            return res.status(401).json({
                status: false,
                message: "Ceredentials did not match",
                errors: {}
            })

        var token = jwt.sign({ id: user._id, userType: 3 }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

        return res.status(200).json({
            status: true,
            message: "Successfully signedin",
            token: token,
            data: user
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
    console.log("User Signup")
    let user = new User(req.body)
    user.save().then((user)=>{
        return res.json({
            success: true,
            message: "Successfully Added",
            data: user
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