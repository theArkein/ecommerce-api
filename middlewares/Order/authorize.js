const jwt = require('jsonwebtoken')
const Product = require('@models/product')

const authorize = (req, res, next)=>{
    if(req.user.userType == 1)
        return next()

    let productId = req.params.id
    console.log("productAuth()")
    
    Product.findById(productId).then(product=>{
        if(product.vendor != req.user.id)
            return res.status(400).json({
                success: false,
                message: "This vendor is not authorized for this product",
            })
        return next()

    }).catch(err=>{
        return res.status(400).json({
            success: false,
            message: "Somehting went wrong",
            errors: err
        })
    })

}

module.exports = authorize