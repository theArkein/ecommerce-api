var Joi = require('joi')

const update = (data)=>{
    const schema = Joi.array().items({
        title: Joi.string().required(),
        category: Joi.string().required(),
        image: Joi.string().required(),
        active: Joi.boolean().required()
    }).max(10).required()

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors  
}
module.exports = {
    update
}