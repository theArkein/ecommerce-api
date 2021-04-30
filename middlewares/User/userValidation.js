const { number } = require('joi')
var Joi = require('joi')

const signin = (data)=>{
    const schema = Joi.object({
        email: Joi.string()
            .required(),
        password: Joi.string()
        .required()
    
    }).options({abortEarly : false, allowUnknown: true})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const signup = (data)=>{
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$'))
        .required(),
        confirmPassword: Joi.ref('password')
    }).options({abortEarly : false, allowUnknown: true})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

module.exports = {
    signin,
    signup
}