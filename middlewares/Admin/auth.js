var Joi = require('joi')

const signin = (data)=>{
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
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
        username: Joi.string().required(),
        password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$'))
        .message({'string.pattern.base':"Password doesn't match strong pattern"})
        .required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
        adminRole: Joi.string(),
        adminPermissions: Joi.array(),
        permittedEntities: Joi.array()
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