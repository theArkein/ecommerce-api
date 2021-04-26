const { number } = require('joi')
var Joi = require('joi')

const signin = (data)=>{
    const schema = Joi.object({
        username: Joi.string()
            .required(),
        password: Joi.string()
        .required()
    
    }).options({abortEarly : false})

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
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        name: Joi.string()
            .min(3)
            .required(),
        password: Joi.string()
        .required(),
    }).options({abortEarly : false})

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