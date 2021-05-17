var Joi = require('joi')

const featuredUpdate = (data)=>{
    const schema = Joi.object({
       mostViewed: Joi.object({
           title: Joi.string().required(),
           order: Joi.number().required(),
           publish: Joi.boolean().required()
       }).required(),
       latest: Joi.object({
        title: Joi.string().required(),
        order: Joi.number().required(),
        publish: Joi.boolean().required()
        }).required(),
        falshDeal: Joi.object({
            title: Joi.string().required(),
            order: Joi.number().required(),
            publish: Joi.boolean().required()
        }).required(),
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const categoryAdd = (data)=>{
    const schema = Joi.object({
        title: Joi.string().required(),
        category: Joi.string().required(),
        order: Joi.number().required(),
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

const categoryUpdate = (data)=>{
    const schema = Joi.object({
        title: Joi.string().required(),
        category: Joi.string().required(),
        order: Joi.number().required(),
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
    featuredUpdate,
    categoryAdd, 
    categoryUpdate
}