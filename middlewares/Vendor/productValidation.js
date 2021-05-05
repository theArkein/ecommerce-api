var Joi = require('joi')

const create = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        shortname: Joi.string().required(),
        price: Joi.number().required(),
        discount: Joi.number().min(0).max(100).required(),
        sku: Joi.string().required(),
        mainCategory: Joi.string().required(),
        subCategory: Joi.string().required(),
        childCategory: Joi.string().required(),
        image: Joi.string().required(),
    }).options({abortEarly : false, allowUnknown: true})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const edit = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        shortname: Joi.string().required(),
        price: Joi.number().required(),
        sku: Joi.string().required(),
        mainCategory: Joi.string().required(),
        subCategory: Joi.string().required(),
        childCategory: Joi.string().required()
    }).options({abortEarly : false, allowUnknown: true})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

module.exports = {
    create,
    edit
}