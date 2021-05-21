var Joi = require('joi')

const signin = (data)=>{
    const schema = Joi.object({
        email: Joi.string()
            .required(),
        password: Joi.string()
        .required()
    
    }).options({abortEarly : false, allowUnknown: true})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors   
}

const signup = (data)=>{
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$'))
        .message({'string.pattern.base':"Password doesn't match strong pattern"})
        .required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password'))
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const passwordReset = (data)=>{
    const schema = Joi.object({
        password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$'))
        .message({'string.pattern.base':"Password doesn't match strong pattern"})
        .required(),
        confirmPassword: Joi.ref('password'),
        otp: Joi.string().required()
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    console.log(validation.error)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const changePassword = (data)=>{
    const schema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$'))
        .message({'string.pattern.base':"Password doesn't match strong pattern"})
        .required(),
        confirmNewPassword: Joi.ref('newPassword')
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    console.log(validation.error)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const profileUpdate = (data)=>{
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        profilePicture: Joi.string().allow(null)
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const shippingAddressAdd = (data)=>{
    const schema = Joi.object({
        label: Joi.string().required(),
        fullname: Joi.string().required(),
        phone: Joi.string().required(),
        region: Joi.string().required(),
        city: Joi.string().required(),
        zone: Joi.string().required(0),
        address: Joi.string().required(),
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const shippingAddressUpdate = (data)=>{
    const schema = Joi.object({
        label: Joi.string().required(),
        fullname: Joi.string().required(),
        phone: Joi.string().required(),
        region: Joi.string().required(),
        city: Joi.string().required(),
        zone: Joi.string().required(0),
        address: Joi.string().required(),
        isDefault: Joi.boolean()
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const wishlistUpdate = (data)=>{
    const schema = Joi.array().options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const addItemToCart = (data)=>{
    const schema = Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1)
    }).options({abortEarly : false})

    let validation = schema.validate(data)
    if(!validation.error)
        return null
    let errors = validation.error.details.map(error=>{
        return {message: error.message, field: error.path[0]}
    })
    return errors 
}

const updateItemInCart = (data)=>{
    const schema = Joi.object({
        quantity: Joi.number().min(1).required()
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
    signin,
    signup,
    passwordReset,
    changePassword,
    profileUpdate,
    shippingAddressAdd,
    shippingAddressUpdate,
    wishlistUpdate,
    addItemToCart,
    updateItemInCart
}