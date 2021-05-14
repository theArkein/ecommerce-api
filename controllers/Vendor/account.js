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
    let {email} = req.body
    if(!email)
        return res.json({
            success: false,
            message: "No email provided"
        })
    let filterQuery = {email}
    Vendor.findOne(filterQuery).then(vendor=>{
        if(!vendor)
            return res.json({
                success: false,
                message: "No vendor found with such email"
            })
        const OTP = uniqid.process()
        Vendor.findByIdAndUpdate(vendor._id, {passwordResetOTP: OTP}).then(vendor=>{
            sendOTP(email, OTP)
            setTimeout(()=>{
                Vendor.findByIdAndUpdate(vendor._id, {passwordResetOTP: null}).then(vendor=>{
                    console.log("OTP cleared for vendor: ", vendor._id)
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
    let {password, otp} = req.body

    let errors = vendorAccountValidate.passwordReset(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let filterQuery = {passwordResetOTP: otp}
    Vendor.findOne(filterQuery).then(vendor=>{
        if(!vendor)
            return res.json({
                success: false,
                message: "OTP expired or didnot match"
            })
            
        var hashedPassword = bcrypt.hashSync(password, config.bcrypt.saltRounds)
        Vendor.findByIdAndUpdate(vendor._id, {password: hashedPassword, passwordResetOTP: null}).then(updated=>{
            return res.json({
                success: true,
                message: "Reset password successfull"
            })
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
    profile,
    profileUpdate,
    verify,
    forgotPassword,
    resetPassword,
}