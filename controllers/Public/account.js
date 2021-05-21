const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')
const config = require('@config/config')
const sendOTP = require('@config/sendOTP')
const bcrypt = require('bcrypt')
const userValidation = require('@middlewares/Public/account')
const User = require('@models/user')

const forgotPassword = (req, res)=>{
    let {email} = req.body
    if(!email)
        return res.json({
            success: false,
            message: "No email provided"
        })
    let filterQuery = {email}
    const OTP = uniqid.process()
    User.findOneAndUpdate(filterQuery, {passwordResetOTP: OTP}).then(user=>{
        if(!user)
            return res.json({
                success: false,
                message: "No user found with such email"
            })
        sendOTP(email, OTP)
        setTimeout(()=>{
            User.findByIdAndUpdate(user._id, {passwordResetOTP: null}).then(user=>{
                console.log("OTP cleared for user: ", user._id)
            })
        }, 5*60*1000)
        return res.json({
            success: true,
            message: "OTP sent to reset password"
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err
        })
    })
}

const resetPassword = (req, res)=>{
    let {email, password, otp} = req.body
    
    let errors = userValidation.passwordReset(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let filterQuery = {email}
    User.findOne(filterQuery).then(user=>{
        if(!user)
            return res.json({
                success: false,
                message: "OTP expired"
            })
        if(!user.passwordResetOTP || user.passwordResetOTP!=otp){
            return res.json({
                success: false,
                message: "OTP didnot match"
            })
        }
        var hashedPassword = bcrypt.hashSync(password, config.bcrypt.saltRounds)
        User.findByIdAndUpdate(user._id, {password: hashedPassword, passwordResetOTP: null}).then(updated=>{
            return res.json(user)
        })
    }).catch(err=>{
        res.json({
            success: false,
            message: "Somethign went wrong",
            err
        })
    })
}

module.exports = {
    forgotPassword,
    resetPassword
}