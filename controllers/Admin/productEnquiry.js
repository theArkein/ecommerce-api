const ProductEnquiry = require("@models/productEnquiry")
const deleteImage = require("@config/deleteImage")

const list = (req, res)=>{
    ProductEnquiry.find().then(products=>{
        return res.json({
            success: true,
            data: products
        })
    })
}

const remove = (req, res)=>{
    ProductEnquiry.findByIdAndDelete({_id: req.params.id}).then(deleted=>{
        if(!deleted)
            return res.json({
                success: false,
                message: "No such id found"
            })

            
        deleteImage(deleted.imageLink)
        return res.json({
            success: true,
            message: "Successfully deleted"
        })
    })
}

module.exports = {
    list,
    remove
}