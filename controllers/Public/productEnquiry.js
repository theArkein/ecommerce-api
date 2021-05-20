const uniqid = require('uniqid')

const productEnquiryValidation = require("@middlewares/Public/productEnquiry")
const ProductEnquiry = require("@models/productEnquiry")

const saveImage = require("@config/saveImage")
const deleteImage = require("@config/deleteImage")

const add = (req, res)=>{
    let errors = productEnquiryValidation.add(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let productEnquiry = new ProductEnquiry(req.body)
    
    let imagePath = `images/product-enquiry/${uniqid()}.png`
    let imageData = productEnquiry.imageLink
    productEnquiry.imageLink = imagePath
    
    productEnquiry.save().then(saved=>{
        saveImage(imageData, imagePath)
        return res.json({
            success: true,
            message: "Successfully added",
            data: saved
        })
    })
}

module.exports = {
    add
}