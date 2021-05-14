var Joi = require('joi')

const profileUpdate = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        description: Joi.string().required(),
        profilePicture: Joi.string().allow(null)
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const passwordReset = (data)=>{
    const schema = Joi.object({
        password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$'))
        .message({'string.pattern.base':"Password doesn't match strong pattern"})
        .required(),
        confirmPassword: Joi.ref('password'),
        otp: Joi.string().required()
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    console.log(validation.error)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}
 
module.exports = {
    profileUpdate,
    passwordReset
}