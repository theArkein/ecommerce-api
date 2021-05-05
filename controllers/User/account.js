const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')
const config = require('@config/config')
const saveImage = require('@config/saveImage')
const sendOTP = require('@config/sendOTP')
const bcrypt = require('bcrypt')
const deleteImage = require('@config/deleteImage')
const userValidation = require('@middlewares/User/userValidation')

const User = require('@models/user')
const ShippingAddress = require('@models/shippingAddress')

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


//profile details
const profileDetailsInfo = (req, res)=>{
    User.findById(req.user.id).then(user=>{
        return res.json({
            success: true,
            data: user.profileDetails
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err: err.errors
        })
    })

}

const profileDetailsUpdate = (req, res)=>{
    let profileDetails= req.body

    let errors = userValidation.profileUpdate(profileDetails)
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
        "profileDetails.firstname": profileDetails.firstname,
        "profileDetails.lastname": profileDetails.lastname,
        "profileDetails.phone": profileDetails.phone,
        "profileDetails.address": profileDetails.address,
        "profileDetails.profilePicture": profileDetails.profilePicture,
    }
    User.findByIdAndUpdate(req.user.id, {$set: update}).then(user=>{
        if(profileDetails.profilePicture)
            deleteImage(user.profileDetails.profilePicture)
        return res.json({
            success: true,
            message: "Successfully Updated"
        })
    }).catch(err=>{
        console.log(err)
        return res.json({
            success: false,
            message: "Somehting went wrong"
        })
    })

}

// shipping details
const shippingAddressAll = (req, res)=>{
    ShippingAddress.find({user: req.user.id}).then(data=>{
        return res.json({
            success: true,
            data: data
        })  
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err: err.errors
        })
    })

}

const shippingAddressOne = (req, res)=>{
    let filterQuery = {
        _id: req.params.id,
        user: req.user.id
    }
    ShippingAddress.findOne(filterQuery).then(data=>{
        if(!data)
            return res.json({
                success: false,
                message: "No shipping address with such id"
            })
        return res.json({
            success: true,
            data
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err: err.errors
        })
    })

}

const shippingAddressAdd = (req, res)=>{

    let errors = userValidation.shippingAddressAdd(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    let newShippingAddress = new ShippingAddress(req.body)
    newShippingAddress.user = req.user.id
    newShippingAddress.save().then(created=>{
        return res.json({
            success: true,
            message: "Successfully added",
            data: created
        })
    })

}

const shippingAddressUpdate = (req, res)=>{
    let errors = userValidation.shippingAddressUpdate(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    let filterQuery = {
        _id: req.params.id,
        user: req.user.id
    }
    let update = req.body
    ShippingAddress.findOne(filterQuery).then(async data=>{
        if(!data)
            return res.json({
                success: false,
                message: "No shipping address with such id"
            })
        if(update.isDefault){
            let removeDefault = await ShippingAddress.findOneAndUpdate({user: req.user.id, isDefault: true}, {isDefault: false})
            console.log("Previous default: " + removeDefault)
        }
        ShippingAddress.findOneAndUpdate(filterQuery, update).then(data=>{
            return res.json({
                success: true,
                message: "Successfully updated",
                data: update
            })
        })
    })

}

const shippingAddressDelete = (req, res)=>{
    let filterQuery = {
        _id: req.params.id,
        user: req.user.id
    }
    ShippingAddress.findOneAndDelete(filterQuery).then(data=>{
        if(!data)
            return res.json({
                success: false,
                message: "No shipping address with such id"
            })
        return res.json({
            success: true,
            data
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err: err.errors
        })
    })

}


module.exports = {
    verify,
    forgotPassword,
    resetPassword,
    profileDetails: {
        info: profileDetailsInfo,
        update: profileDetailsUpdate
    },
    shippingAddress: {
        all: shippingAddressAll,
        one: shippingAddressOne,
        add: shippingAddressAdd,
        update: shippingAddressUpdate,
        delete: shippingAddressDelete,
    }
}