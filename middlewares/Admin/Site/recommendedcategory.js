var Joi = require('joi')

const add = (data)=>{
    const schema = Joi.object({
        title: Joi.string().required(),
        category: Joi.string().required(),
        order: Joi.number().required(),
        image: Joi.string(),
        publish: Joi.boolean().required()
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
        title: Joi.string().required(),
        category: Joi.string().required(),
        order: Joi.number().required(),
        image: Joi.string(),
        publish: Joi.boolean().required()
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