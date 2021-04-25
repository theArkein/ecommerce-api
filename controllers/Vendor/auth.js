const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const slugify = require('slugify')

const Vendor = require('@models/vendor')
const config = require("@config/config.json")
const vendorValidate = require("@middlewares/Vendor/vendorValidation")

const signin = (req, res)=>{
    console.log("Vendor Signin")
    let {username, password} = req.body
    
    let errors = vendorValidate.signin(req.body)
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

        const token = jwt.sign({ id: vendor._id, userType: 2 }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

        // const decoded = jwt.verify(token, config.jwt.SECRET)
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
    let errors = vendorValidate.signup(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
    const slug = slugify(req.body.username)
    let newVendor = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        name: req.body.name,
        slug,
    }
    let vendor = new Vendor(newVendor)
    console.log(vendor)
    vendor.save().then((vendor)=>{
        return res.json({
            success: true,
            message: "Successfully Added",
            data: vendor
        })

    }).catch(err=>{
        console.log(err.code)
        if(err.code==11000)
            return res.json({
                status: false,
                message: `${Object.keys(err.keyValue)[0]} must be unique`,
        })

        return res.json({
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