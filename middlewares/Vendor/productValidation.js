var Joi = require('joi')

const create = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        shortname: Joi.string().required(),
        sku: Joi.string(),
        price: Joi.number().required(),
        discount: Joi.number().max(100).min(0),
        stock: Joi.number().min(0),
        brand: Joi.string(),
        description: Joi.string(),
        paymentOption: Joi.object({
            cod: Joi.boolean()
        }),
        deliveryOption: Joi.array().items({
            title: Joi.string().required(),
            description: Joi.string().required(),
            charge: Joi.number().required()
        }),
        return: Joi.object({
            title: Joi.string().required(),
            description: Joi.string()
        }),
        warranty: Joi.object({
            title: Joi.string().required(),
            description: Joi.string()
        }),
        variant: Joi.object({
            types: Joi.array().items(Joi.string().required()),
            variants: Joi.object().required()
        }),
        mainCategory: Joi.string().required(),
        subCategory: Joi.string().required(),
        childCategory: Joi.string().required(),
        image: Joi.string().required(),
        gallery: Joi.array(),
        publish: Joi.boolean(),
        tags: Joi.string()
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
        name: Joi.string().required(),
        shortname: Joi.string().required(),
        sku: Joi.string(),
        price: Joi.number().required(),
        discount: Joi.number().max(100).min(0),
        stock: Joi.number().min(0),
        brand: Joi.string(),description: Joi.string(),
        paymentOption: Joi.object({
            cod: Joi.boolean()
        }),
        deliveryOption: Joi.array().items({
            title: Joi.string().required(),
            description: Joi.string().required(),
            charge: Joi.number().required()
        }),
        return: Joi.object({
            title: Joi.string().required(),
            description: Joi.string()
        }),
        warranty: Joi.object({
            title: Joi.string().required(),
            description: Joi.string()
        }),
        variant: Joi.object({
            types: Joi.array().items(Joi.string().required()),
            variants: Joi.object().required()
        }),
        mainCategory: Joi.string().required(),
        subCategory: Joi.string().required(),
        childCategory: Joi.string().required(),
        image: Joi.string(),
        gallery: Joi.array(),
        publish: Joi.boolean().required(),
        tags: Joi.string(),
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
    create,
    update
}