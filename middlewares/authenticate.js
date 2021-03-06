const jwt = require('jsonwebtoken')
const config = require('@config/config.json')
const User = require('@models/user')
const Vendor = require('@models/vendor')
const Admin = require('@models/admin')


const authenticate = (req, res, next)=>{
    console.log("Authenticate()")
    req.user = null // Guest Users by default

    // if not authorization token then authenticate = guest
    if(!req.headers.authorization){
        console.log("Authentication: Guest", req.user)
        return next()
    }

    let [authorizationType, token] = req.headers.authorization.split(' ')

    // if invalid authorization token then authenticate = guest
    if(authorizationType != "Bearer"){
        console.log("Authentication: Guest", req.user)
        return next()
    }

    try{
        var decoded = jwt.verify(token, config.jwt.SECRET)
    }
    catch(err){
        return res.json({
            success: false,
            message: "Invalid signature, token malfunctioned.",
        })
    }
    // if authorization token provided authenticate = user-3/vendor-2/admin-1
    req.user = decoded
    console.log("Authentication: ", req.user.userType)
    
    if(req.user.userType == 3){
        // check if authenticated user(customer) exists
        User.findById(req.user.id).then(user=>{
            if(!user){
                return res.json({
                    success: false,
                    message: "User doesnot exists. (Deleted)",
                })
            }
            next()
        })
    } else if(req.user.userType == 2){
        // check if authenticated vendor exists
        Vendor.findById(req.user.id).then(vendor=>{
            if(!vendor){
                return res.json({
                    success: false,
                    message: "User doesnot exists. (Deleted)",
                })
            }
            if(vendor.accountStatus==3)
                return res.json({
                    success: false,
                    message: "Account suspended. Please contact admin",
                    errors: {}
                })
            if(vendor.accountStatus!=2)
                return res.json({
                    success: false,
                    message: "Something went wrong with your account, contact admin",
                    errors: {}
                })

            next()
        })
    }else if(req.user.userType == 1){
        // check if authenticated admin exists
        Admin.findById(req.user.id).then(admin=>{
            if(!admin){
                return res.json({
                    success: false,
                    message: "User doesnot exists. (Deleted)",
                })
            }
            req.admin = admin
            next()
        })
    }
}

module.exports = authenticate