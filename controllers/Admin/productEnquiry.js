const ProductEnquiry = require("@models/productEnquiry")

const list = (req, res)=>{
    ProductEnquiry.find().then(products=>{
        return res.json({
            success: true,
            data: products
        })
    })
}

module.exports = {
    list
}