const userValidation = require('@middlewares/User/userValidation')
const ShippingAddress = require('@models/shippingAddress')

const all = (req, res)=>{
    ShippingAddress.find({user: req.user.id}).then(data=>{
        return res.json({
            success: true,
            data: data
        })  
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err: err.errors
        })
    })

}

const one = (req, res)=>{
    let filterQuery = {
        _id: req.params.id,
        user: req.user.id
    }
    ShippingAddress.findOne(filterQuery).then(data=>{
        if(!data)
            return res.json({
                success: false,
                message: "No shipping address with such id"
            })
        return res.json({
            success: true,
            data
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err: err.errors
        })
    })

}

const add = (req, res)=>{

    let errors = userValidation.shippingAddressAdd(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    let newShippingAddress = new ShippingAddress(req.body)
    newShippingAddress.user = req.user.id
    newShippingAddress.save().then(created=>{
        return res.json({
            success: true,
            message: "Successfully added",
            data: created
        })
    })

}

const update = (req, res)=>{
    let errors = userValidation.shippingAddressUpdate(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    let filterQuery = {
        _id: req.params.id,
        user: req.user.id
    }
    let update = req.body
    ShippingAddress.findOne(filterQuery).then(async data=>{
        if(!data)
            return res.json({
                success: false,
                message: "No shipping address with such id"
            })
        if(update.isDefault){
            let removeDefault = await ShippingAddress.findOneAndUpdate({user: req.user.id, isDefault: true}, {isDefault: false})
            console.log("Previous default: " + removeDefault)
        }
        ShippingAddress.findOneAndUpdate(filterQuery, update).then(data=>{
            return res.json({
                success: true,
                message: "Successfully updated",
                data: update
            })
        })
    })

}

const remove = (req, res)=>{
    let filterQuery = {
        _id: req.params.id,
        user: req.user.id
    }
    ShippingAddress.findOneAndDelete(filterQuery).then(data=>{
        if(!data)
            return res.json({
                success: false,
                message: "No shipping address with such id"
            })
        return res.json({
            success: true,
            data
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Something went wrong",
            err: err.errors
        })
    })

}

module.exports = {
    all,
    one,
    add,
    update,
    remove
}