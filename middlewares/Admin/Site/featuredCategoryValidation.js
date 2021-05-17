var Joi = require('joi')

const update = (data)=>{
    const schema = Joi.object({
        A: Joi.object({
            active: Joi.boolean().required(),
            title: Joi.when('active', {
                is: true,
                then: Joi.string().min(4).required()
              }),
            category: Joi.when('active', {
                is: true,
                then: Joi.string().required()
              }).when('active', {
                is: false,
                then: Joi.allow(null)
              }),
        }).required(),
        B: Joi.object({
            active: Joi.boolean().required(),
            title: Joi.when('active', {
                is: true,
                then: Joi.string().min(4).required()
              }),
            category: Joi.when('active', {
                is: true,
                then: Joi.string().required()
              }).when('active', {
                is: false,
                then: Joi.allow(null)
              })
        }).required(),
        C: Joi.object({
            active: Joi.boolean().required(),
            title: Joi.allow(null).when('active', {
                is: true,
                then: Joi.string().min(4).required()
              }),
            category: Joi.when('active', {
                is: true,
                then: Joi.string().required()
              }).when('active', {
                is: false,
                then: Joi.allow(null)
              })
        }).required()
    }).options({abortEarly : false, allowUnknown: false})

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