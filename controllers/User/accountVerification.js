const jwt = require('jsonwebtoken')
const config = require('@config/config')

const User = require('@models/user')

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
        User.findByIdAndUpdate(user._id, {status: 2}).then(updated=>{
            return res.json({
                success:true,
                message: "Account successfully activated"
            })
        }).catch(err=>{
            return res.json({
                success:false,
                message: "Something went wrong"
            })
        })
    })
}

module.exports = {verify}