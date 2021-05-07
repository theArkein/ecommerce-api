const { when } = require("joi")
const Joi = require("joi")

const add = (data)=>{
    const schema = Joi.object({
        comment: Joi.string().required(),
        parentComment: Joi.string(),
        product: Joi.string().when('parentComment', {
            is: undefined,
            then: Joi.string().required()
          }),
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const update = (data)=>{
    const schema = Joi.object({
        comment: Joi.string()
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
    add,
    update
}