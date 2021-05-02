const User = require('@models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require("@config/config.json")
const userValidation = require('@middlewares/User/userValidation')
const { default: slugify } = require('slugify')
const sendVerificationToken = require('@config/sendVerificationToken')

const signin = (req, res)=>{
    console.log("User Signin")
    let {email, password} = req.body
    
    let errors = userValidation.signin(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    User.findOne({email}).then(user=>{
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
        if(!user.verified)
            return res.status(401).json({
                status: false,
                message: "Please verify your account first",
                errors: {}
            })

        const token = jwt.sign({ id: user._id, userType: 3 }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

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
    let errors = userValidation.signup(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
    let user = new User(req.body)

    const token = jwt.sign({ id: user._id, userType: 3 }, config.jwt.SECRET, { expiresIn: 5*60*1000 })

    User.findOne({email: user.email}).then(registered=>{
        if(registered)
            return res.json({
                success: false,
                message: "Already registered with this email"
            })
        user.save().then((user)=>{
            sendVerificationToken(user.email, token)
            console.log(user)
            return res.json({
                success: true,
                message: "Successfully registered, verification needed"
            })
        })
    }) 
}

const google = (req, res)=>{
    let user = req.user
    const token = jwt.sign({ id: user._id, userType: 3 }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

    return res.status(200).json({
        status: true,
        message: "Successfully signedin",
        token: token,
        data: user
    })
}

const facebook = (req, res)=>{
    let user = req.user
    const token = jwt.sign({ id: user._id, userType: 3 }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

    return res.status(200).json({
        status: true,
        message: "Successfully signedin",
        token: token,
        data: user
    })
}

module.exports = {
    signin,
    signup,
    google,
    facebook
}