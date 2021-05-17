var Joi = require('joi')

const add = (data)=>{
    const schema = Joi.object({
        image: Joi.string().required(),
        title: Joi.string().required(),
        btnText: Joi.string().required(),
        link: Joi.string().required(),
        order: Joi.number().required(),
        publish: Joi.boolean().required(),
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
        image: Joi.string().required(),
        title: Joi.string().required(),
        btnText: Joi.string().required(),
        link: Joi.string().required(),
        order: Joi.number().required(),
        publish: Joi.boolean().required(),
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