const productEnquiryValidation = require("@middlewares/Public/productEnquiry")
const ProductEnquiry = require("@models/productEnquiry")

const add = (req, res)=>{
    let errors = productEnquiryValidation.add(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    let productEnquiry = new ProductEnquiry(req.body)
    productEnquiry.save().then(saved=>{
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