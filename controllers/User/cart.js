const User = require('@models/user')
const Product = require('@models/product')
const ObjectID = require('mongodb').ObjectID

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

const addIte = (req, res)=>{
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
    User.findOne(filterQuery)
    .populate('cart.product', 'vendor')
    .then(result=>{
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

const addItem = async (req, res)=>{
    let errors = userValidation.addItemToCart(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let cart = new Promise((resolve, reject)=>{
        User.findById(req.user.id)
        .populate('cart.product', 'vendor')
        .exec((err, data)=>{
            if(err)
                reject(err)
            resolve(data.cart)
        })
    })
    let product = new Promise((resolve, reject)=>{
        Product.findById(req.body.product)
        .select('vendor')
        .exec((err, data)=>{
            if(!data){
                return res.json({
                    success: false,
                    message: "No such product"
                })
            }
            if(err)
                reject(err)
            resolve(data)
        })

    })

    let promiseResult = await Promise.all([cart, product])
    cart = promiseResult[0]
    product = promiseResult[1]
    if(cart.length){
        if(`${cart[0].product.vendor._id}` != `${product.vendor._id}`){
            return res.json({
                success: false,
                message: "Cart must have products from same vendor"
            })
        }
    }
        let filterQuery = {
            _id: req.user.id,
            "cart.product": req.body.product
        }
        let u = {
            "cart.$.product": req.body.product,
            $inc: {"cart.$.quantity": 1}
        }
        if(req.body.quantity){
            u = {
                "cart.$.product": req.body.product,
                "cart.$.quantity": req.body.quantity
            }
        }
        User.findOneAndUpdate(filterQuery, u)
        .then(result=>{
            if(result){
                return res.json({
                    success: false,
                    message: "Product successfully added to cart"
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