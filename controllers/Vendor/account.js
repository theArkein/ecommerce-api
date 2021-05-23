const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')
const config = require('@config/config')
const sendOTP = require('@config/sendOTP')
const bcrypt = require('bcrypt')

const Vendor = require('@models/vendor')
const vendorAccountValidate = require("@middlewares/Vendor/account")

const saveImage = require('@config/saveImage')
const deleteImage = require('@config/deleteImage')

const profile = (req, res)=>{
    let id = req.user.id
    Vendor.findById(id)
    .then(vendor=>{
        return res.json({
            success: true,
            data: vendor.profileDetails
        })
    })
}

const profileUpdate = (req, res)=>{
    
    let errors = vendorAccountValidate.profileUpdate(req.body)
    if(errors)
    return res.json({
        success: false,
        message: "Validation failed",
        errors
    })
    
    let id = req.user.id
    // let profilePictureData = profilePicturePath = null
    if(req.body.profilePicture){
        var profilePicturePath = `images/vendors/${id}/${uniqid()}.png`
        var profilePictureData = req.body.profilePicture
        req.body.profilePicture = profilePicturePath
        console.log(profilePicturePath)
    }

    let update = {
        profileDetails: req.body
    }

    Vendor.findByIdAndUpdate(id, update).then(vendor=>{

        // delete old and save new
        saveImage(profilePictureData, profilePicturePath)
        deleteImage(vendor.profileDetails.profilePicture)

        return res.json({
            success: true,
            data: vendor
        })

    })
}

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
        return res.json({
            success: false,
            message: "Invalid signature, token expired or malfunctioned",
        })
    }

    Vendor.findByIdAndUpdate(decoded.id, {accountStatus: 1}).then(updated=>{
        if(!updated){
            return res.json({
                success: false,
                message: "Vendor doesnot exists or deleted",
            })
        }
        return res.json({
            success:true,
            message: "Account successfully verified. Admin approval remaining"
        })
    }).catch(err=>{
        return res.json({
            success:false,
            message: "Something went wrong"
        })
    })
}

const forgotPassword = (req, res)=>{
    if(!req.user && !req.body.email){
        return res.json({
            success: false,
            message: "Please provide vendor email"
        })
    }
    let filterQuery = null
    if(req.user)
        filterQuery = {_id: req.user.id}
    if(req.body.email)
        filterQuery = {email: req.body.email}

    const OTP = uniqid.process()
    Vendor.findOneAndUpdate(filterQuery, {passwordResetOTP: OTP}).then(user=>{
        sendOTP(user.email, OTP)
        setTimeout(()=>{
            Vendor.findByIdAndUpdate(user._id, {passwordResetOTP: null}).then(user=>{
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
    let {password, otp} = req.body
    
    let errors = vendorAccountValidate.passwordReset(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })
    if(!req.user && !req.body.email){
        return res.json({
            success: false,
            message: "Please provide vendor email"
        })
    }
    let filterQuery = null
    if(req.user)
        filterQuery = {_id: req.user.id}
    if(req.body.email)
        filterQuery = {email: req.body.email}

    Vendor.findOne(filterQuery).then(user=>{
        if(!user.passwordResetOTP)
            return res.json({
                success: false,
                message: "OTP expired"
            })
        if(user.passwordResetOTP!=otp){
            return res.json({
                success: false,
                message: "OTP didnot match"
            })
        }
        var hashedPassword = bcrypt.hashSync(password, config.bcrypt.saltRounds)
        Vendor.findByIdAndUpdate(user._id, {password: hashedPassword, passwordResetOTP: null}).then(updated=>{
            return res.json({
                success: true,
                message: "Password successfully resetted"
            })
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong"
        })
    })
}

const changePassword = (req, res)=>{
    let {oldPassword, newPassword} = req.body
    
    let errors = vendorAccountValidate.changePassword(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })
    
    if(oldPassword == newPassword){
        return res.json({
            success: false,
            message: "New password must not be same as old password"
        })
    }

    let filterQuery = {_id: req.user.id}
    Vendor.findOne(filterQuery).then(user=>{
        let isMatch = bcrypt.compareSync(oldPassword, user.password);
        if(!isMatch)
            return res.json({
                success: false,
                message: "Old password didnot match"
            })
            var hashedPassword = bcrypt.hashSync(newPassword, config.bcrypt.saltRounds)
            Vendor.findByIdAndUpdate(user._id, {password: hashedPassword}).then(updated=>{
            if(updated){
                return res.json({
                    success: true,
                    message: "Password successfully changed"
                })
            }
        }).catch(err=>{
            return res.json({
                success: true,
                message: "Something went wrong"
            })
        })
        
    })
}


module.exports = {
    profile,
    profileUpdate,
    verify,
    forgotPassword,
    resetPassword,
    changePassword
}