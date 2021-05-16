const Joi = require("joi")

const create = (data)=>{
    const schema = Joi.object({
        shippingAddress: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                phone: Joi.string().required(),
                address: Joi.string().required(),
                country: Joi.string(),
                postalCode: Joi.string(),
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
    create
}