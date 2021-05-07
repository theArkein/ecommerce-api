const { when } = require("joi")
const Joi = require("joi")

const add = (data)=>{
    const schema = Joi.object({
        review: Joi.string().required(),
        rating: Joi.number().min(1).max(5),
        product: Joi.string().required(),
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