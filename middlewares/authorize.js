const jwt = require('jsonwebtoken')
const config = require('@config/config.json')

const authorize = (roles)=>{
    return (req, res, next)=>{
        console.log("Authorize()")
        
        // not authorized if no authorization token provided    
        if(!req.user)
            return res.status(400).json({
                "success": false,
                message: "No authentication provided"
            })
        
        // not authorized if userType is different then authorized userTypes eg: [1,2,3]
        if(!roles.includes(req.user.userType))
            return res.status(400).json({
                "success": false,
                message: "Not Authorized"
            })

        console.log("Authorized userType: ", req.user.userType)
        next()
    }
}

module.exports = authorize