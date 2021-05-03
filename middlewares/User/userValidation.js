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

const profileUpdate = (data)=>{
    const schema = Joi.object({
        profileDetails: Joi.object({
            firstname: Joi.string().allow(null),
            lastname: Joi.string().allow(null),
            email: Joi.string().allow(null),
            phone: Joi.string().allow(null),
            address: Joi.string().allow(null),
            profilePicture: Joi.string().allow(null)
        }).required(),
        shippingDetails: Joi.object({
            fullname: Joi.string().allow(null),
            phone: Joi.string().allow(null),
            region: Joi.string().allow(null),
            city: Joi.string().allow(null),
            zone: Joi.string().allow(null),
            address: Joi.string().allow(null)
        }).required()
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
    signup,
    profileUpdate
}