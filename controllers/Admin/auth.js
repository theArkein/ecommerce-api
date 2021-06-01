var Admin = require('@models/admin')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const authValidation = require('@middlewares/Admin/auth')
const config = require("@config/config.json")

const list = (req,res)=>{
    Admin.find({}).then(admins=>{
        res.json({
            success: true,
            data: admins
        })
    })
}

const signin = (req, res)=>{
    console.log("Admin Signin")
    let {username, password} = req.body
    
    let errors = authValidation.signin(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    Admin.findOne({username}).then(admin=>{
        console.log(admin)
        if(!admin)
            return res.json({
                success: false,
                message: "No accounts with such id",
            })
        let isMatch = bcrypt.compareSync(password, admin.password);
        if(!isMatch)
            return res.json({
                success: false,
                message: "Ceredentials did not match",
                errors: {}
            })

        var token = jwt.sign({ id: admin._id, userType: 1 }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

        // var decoded = jwt.verify(token, config.jwt.SECRET)
        return res.json({
            success: true,
            message: "Successfully signedin",
            token: token,
            data: admin
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            errors: err
        })
    })

}

const signup = (req, res)=>{
    console.log("Admin Signup")

    let errors = authValidation.signup(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let admin = new Admin(req.body)
    admin.save().then((admin)=>{
        return res.json({
            success: true,
            message: "Successfully Added",
            data: admin
        })

    }).catch(err=>{
        return res.json({
            success: false,
            message: (err.code == 11000 )? "Username already exists" : "Something went wrong",
            errors: err.errors
        })
    })  
}

module.exports = {
    list,
    signin,
    signup,
}