const Joi = require('joi')

const updateLarge = (data)=>{
    const schema = Joi.object({
        image: Joi.string(),
        preTitle: Joi.string(),
        title: Joi.string().required(),
        subTitle: Joi.string(),
        price: Joi.string(),
        btnText: Joi.string().required(),
        btnLink: Joi.string().required(),
        publish: Joi.boolean()
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const updateSmall = (data)=>{
    const schema = Joi.object({
        image: Joi.string(),
        preTitle: Joi.string(),
        title: Joi.string().required(),
        subTitle: Joi.string(),
        price: Joi.string(),
        link: Joi.string().required(),
        order: Joi.number().required(),
        publish: Joi.boolean()
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
    updateLarge,
    updateSmall
}