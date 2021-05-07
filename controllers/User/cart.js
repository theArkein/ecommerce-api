const User = require('@models/user')
const userValidation = require("@middlewares/user/userValidation")

const info = (req, res)=>{
    User.findById(req.user.id)
    .populate({
        path: 'cartlist.product',
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
    let item = req.params.id
    let filterQuery = {
        _id: req.user.id,
        "cart.product":  item
    }
    User.findOneAndUpdate(filterQuery, {$inc: {"cart.$.quantity": 1}}).then(user=>{
        if(!user){
            let cartItem = {
                product: item,
                quantity: 1
            }
            User.findByIdAndUpdate(req.user.id, {$push: {cart: cartItem}}).then(user=>{
                return res.json({
                    success: true,
                    message: "Successfully added"
                })
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
}

const update= (req, res)=>{
    let errors = userValidation.cartUpdate(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
        
    let update = req.body
    User.findByIdAndUpdate(req.user.id, {cart: update}).then(user=>{
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
        "cart.product": item
    }
    User.findOneAndUpdate(filterQuery, {$pull : {cart: {product: item}} }).then(deleted=>{
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
    update,
    deleteItem
}