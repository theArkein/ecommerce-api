const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')
const config = require('@config/config')
const saveImage = require('@config/saveImage')
const sendOTP = require('@config/sendOTP')
const User = require('@models/user')
const bcrypt = require('bcrypt')
const deleteImage = require('@config/deleteImage')
const userValidation = require('@middlewares/User/userValidation')


const verify = (req, res)=>{
    let token = req.query.token
    if(!token)
        return res.json({
            success: false,
            message: "No token provided to verify account"
        })
    
    try{
        var decoded = jwt.verify(token, config.jwt.SECRET)
    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: "Invalid signature, token expired or malfunctioned",
        })
    }

    User.findById(decoded.id).then(user=>{
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesnot exists or deleted",
            })
        }
        User.findByIdAndUpdate(user._id, {verified: true}).then(updated=>{
            return res.json({
                success:true,
                message: "Account successfully verified"
            })
        }).catch(err=>{
            return res.json({
                success:false,
                message: "Something went wrong"
            })
        })
    })
}

const forgotPassword = (req, res)=>{
    let {email} = req.body
    if(!email)
        return res.json({
            success: false,
            message: "No email provided"
        })
    let filterQuery = {email}
    User.findOne(filterQuery).then(user=>{
        if(!user)
            return res.json({
                success: false,
                message: "No user found with such email"
            })
        const OTP = uniqid.process()
        User.findByIdAndUpdate(user._id, {passwordResetOTP: OTP}).then(user=>{
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
    })
}
const resetPassword = (req, res)=>{
    let {password, confirmPassword, otp} = req.body
    if(!password || !confirmPassword || !otp)
        return res.json({
            success: false,
            message: "All fields are required",
        })
    if(password != confirmPassword)
        return res.json({
            success: false,
            message: "'password' and 'confirm password' should be exact match",
        })
    let filterQuery = {passwordResetOTP: otp}
    User.findOne(filterQuery).then(user=>{
        if(!user)
            return res.json({
                success: false,
                message: "OTP expired or didnot match"
            })
            
        var hashedPassword = bcrypt.hashSync(password, config.bcrypt.saltRounds)
        User.findByIdAndUpdate(user._id, {password: hashedPassword}).then(updated=>{
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

const profileDetails = (req, res)=>{
    User.findById(req.user.id).then(user=>{
        return res.json({
            success: true,
            data: {
                profileDetails: user.profileDetails,
                shippingDetails: user.shippingDetails,
            }
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err: err.errors
        })
    })

}

const profileUpdate = (req, res)=>{
    let {profileDetails, shippingDetails} = req.body

    let errors = userValidation.profileUpdate(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

        if(profileDetails.profilePicture){
            let profilePicture = `images/user/profile/${uniqid()}${uniqid()}.png`
            saveImage(profileDetails.profilePicture, profilePicture)
            profileDetails.profilePicture = profilePicture
        }
    
    let update = {
        profileDetails,
        shippingDetails
    }
    User.findByIdAndUpdate(req.user.id, update).then(user=>{
        if(user.profileDetails.profilePicture)
            deleteImage(user.profileDetails.profilePicture)
        return res.json({
            success: true,
            message: "Successfully Updated"
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Somehting went wrong"
        })
    })

}

module.exports = {
    verify,
    forgotPassword,
    resetPassword,
    profileDetails,
    profileUpdate
}