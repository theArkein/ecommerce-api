const User = require('@models/user')
const userValidation = require("@middlewares/User/userValidation")

const info = (req, res)=>{
    User.findById(req.user.id)
    .populate({
        path: "cart.product",
        select: 'name shortname slug sku vendor price discount image stock'
    })
    .then(user=>{
        return res.json({
            success: true,
            data: user.cart
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Somehting went wrong",
            error: err.errors
        })
    })
}

const addItem = (req, res)=>{
    let errors = userValidation.addItemToCart(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let filterQuery = {
        _id: req.user.id,
        "cart.product": req.body.product
    }
    User.findOne(filterQuery).then(result=>{
        if(result){
            return res.json({
                success: false,
                message: "Product already exists in cart"
            })
        }
        User.findOneAndUpdate({_id: req.user.id}, {$push : {cart: req.body} }).then(updated=>{
            console.log(updated)
            if(!updated){
                return res.json({
                    success: false,
                    message: "Failed to add"
                })
            }
            return res.json({
                success: true,
                message: "Successfully added"
            })
        }).catch(err=>{
            return res.json({
                success: false,
                message: "Somehting went wrong",
                error: err.errors
            })
        })
    })

    
}

const updateItem = (req, res)=>{
    let errors = userValidation.updateItemInCart(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let filterQuery = {
        _id: req.user.id,
        "cart._id": req.params.id
    }
    User.findOneAndUpdate(filterQuery, {$set : {"cart.$.quantity": req.body.quantity} }).then(updated=>{
        console.log(updated)
        if(!updated){
            return res.json({
                success: false,
                message: "Cart does not have such product"
            })
        }
        return res.json({
            success: true,
            message: "Successfully updated"
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Somehting went wrong",
            error: err.errors
        })
    })
}

const deleteItem = (req, res)=>{
    let item = req.params.id
    let filterQuery = {
        _id: req.user.id,
        "cart._id": item
    }
    User.findOneAndUpdate(filterQuery, {$pull : {cart: {_id: item}} }).then(deleted=>{
        console.log(deleted)
        if(!deleted){
            return res.json({
                success: false,
                message: "Product doesn't exists in cart"
            })
        }
        return res.json({
            success: true,
            message: "Successfully deleted"
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Somehting went wrong",
            error: err.errors
        })
    })
}


module.exports = {
    info,
    addItem,
    updateItem,
    deleteItem
}