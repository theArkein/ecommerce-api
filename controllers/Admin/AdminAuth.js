var Admin = require('../../models/admin')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var Joi = require('joi')
const config = require("../../config/config.json")

const validate = (data)=>{
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
        .required()
    
    })
    let validation = schema.validate(data)
    if(!validation.error)
        return false
    let error = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const signin = (req, res)=>{
    console.log("Admin Signin")
    let {username, password} = req.body

    console.log(validate({username: "sarad", password: "gshavjsbh"}))

    // Admin.findOne({username}).then(admin=>{
    //     let isMatch = bcrypt.compareSync(password, admin.password);
    //     if(!isMatch)
    //         return res.status(200).json({
    //             status: false,
    //             message: "Ceredentials did not match",
    //             errors: {}
    //         })

    //     var token = jwt.sign({ id: admin._id }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRY })

    //     // var decoded = jwt.verify(token, config.jwt.SECRET)

    //     return res.status(403).json({
    //         status: true,
    //         message: "Successfully signedin",
    //         token: token,
    //         data: admin
    //     })
    // }).catch(err=>{
    //     return res.status(500).json({
    //         success: false,
    //         message: "Something went wrong",
    //         errors: err
    //     })
    // })

}

const signup = (req, res)=>{
    console.log("Admin Signup")
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
            message: "Something went wrong",
            errors: err
        })
    })  
}

module.exports = {
    signin,
    signup,
}