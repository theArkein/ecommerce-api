const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const slugify = require('slugify')

const Vendor = require('@models/vendor')
const config = require("@config/config.json")
const sendVerificationToken = require("@config/sendVerificationToken")
const vendorValidate = require("@middlewares/Vendor/vendorValidation")

const signin = (req, res)=>{
    console.log("Vendor Signin")
    let {email, password} = req.body
    
    let errors = vendorValidate.signin(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    Vendor.findOne({email}).then(vendor=>{
        console.log(vendor)
        if(!vendor)
            return res.status(400).json({
                success: false,
                message: "No accounts with such id",
            })
        let isMatch = bcrypt.compareSync(password, vendor.password);
        if(!isMatch)
            return res.status(401).json({
                success: false,
                message: "Ceredentials did not match",
                errors: {}
            })
        if(vendor.accountStatus==0)
            return res.status(401).json({
                success: false,
                message: "Account not verified. Please verify first",
                errors: {}
            })
        if(vendor.accountStatus==1)
            return res.status(401).json({
                success: false,
                message: "Account not approved yet. Please contact admin",
                errors: {}
            })
        if(vendor.accountStatus==3)
            return res.status(401).json({
                success: false,
                message: "Account suspended. Please contact admin",
                errors: {}
            })

        const token = jwt.sign({ id: vendor._id, vendorType: 2 }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

        // const decoded = jwt.verify(token, config.jwt.SECRET)
        return res.status(200).json({
            success: true,
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
    let errors = vendorValidate.signup(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
    let newVendor = {
        email: req.body.email,
        password: req.body.password,
    }
    let vendor = new Vendor(newVendor)
    const token = jwt.sign({ id: vendor._id, userType: 2 }, config.jwt.SECRET, { expiresIn: 5*60*1000 })

    Vendor.findOne({email: vendor.email}).then(registered=>{
        if(registered)
            return res.json({
                success: false,
                message: "Already registered with this email"
            })
        vendor.save().then((vendor)=>{
            sendVerificationToken(2, vendor.email, token)
            return res.json({
                success: true,
                message: "Successfully registered, verification needed"
            })
        })
    })  
}

module.exports = {
    signin,
    signup,
}