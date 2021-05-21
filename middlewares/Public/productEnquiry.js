const Joi = require("joi")

const add = (data)=>{
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        contact: Joi.number().required(),
        product: Joi.string().required(),
        image: Joi.string(),
        imageLink: Joi.string(),
        productDescription: Joi.string().required(),
        enquiry: Joi.string().required(),
        expectedDeliveryDays: Joi.string().required(),
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
    add
}