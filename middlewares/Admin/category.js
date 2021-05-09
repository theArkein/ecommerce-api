var Joi = require('joi')

const mainCategoryCreate = (data)=>{
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        icon: Joi.string()
        .required(),
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

const mainCategoryEdit = (data)=>{
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        icon: Joi.string(),
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

const subCategoryCreate = (data)=>{
    const schema = Joi.object({
        name: Joi.string()
            
            .min(3)
            .max(30)
            .required(),
        parent: Joi.string()
        .required()
    
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const subCategoryEdit = (data)=>{
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        parent: Joi.string()
        .required()
    
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const childCategoryCreate = (data)=>{
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        parent: Joi.string()
        .required(),
        grandParent: Joi.string()
        .required()
    
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const childCategoryEdit = (data)=>{
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        parent: Joi.string()
        .required(),
        grandParent: Joi.string()
        .required()
    
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
    mainCategoryCreate,
    mainCategoryEdit,
    subCategoryCreate,
    subCategoryEdit,
    childCategoryCreate,
    childCategoryEdit,
}