const { boolean } = require('joi')
var Joi = require('joi')

const update = (data)=>{
    const schema = Joi.object({
        large: Joi.object({
            image: Joi.string().required(),
            title: Joi.string().required(),
            subTitle: Joi.string().allow(null).required(),
            btnText: Joi.string().required(),
            btnLink: Joi.string().required(),
            active: Joi.boolean()
        }).required(),
        small: Joi.array().items(Joi.object({
          image: Joi.string().required(),
          title: Joi.string().required(),
          preTitle: Joi.string().allow(null).required(),
          postTitle: Joi.string().allow(null).required(),
          price: Joi.string().required(),
          link: Joi.string().required(),
          active: Joi.boolean()
        })).required().max(4).min(4)
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