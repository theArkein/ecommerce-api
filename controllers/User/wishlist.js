const User = require('@models/user')
const userValidation = require("@middlewares/user/userValidation")

const info = (req, res)=>{
    User.findById(req.user.id)
    .populate({
        path: 'wishlist',
        select: 'name shortname slug sku vendor price discount image stock'
    })
    .then(user=>{
        return res.json({
            success: true,
            data: user.wishlist
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
        wishlist: {$ne: item}
    }
    User.findOneAndUpdate(filterQuery, {$push: {wishlist: item}}).then(user=>{
        if(!user){
            return res.json({
                success: false,
                message: "Product already exists in wishlist"
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
    let errors = userValidation.wishlistUpdate(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    let update = req.body
    User.findByIdAndUpdate(req.user.id, {wishlist: update}).then(user=>{
        return res.json({
            success: true,
            data: update
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
    let id = req.params.id
    let item = req.params.id
    let filterQuery = {
        _id: req.user.id,
        wishlist: item
    }
    User.findOneAndUpdate(filterQuery, {$pull : {wishlist: id} }).then(deleted=>{
        if(!deleted){
            return res.json({
                success: false,
                message: "Product doesn't exists in wishlist"
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