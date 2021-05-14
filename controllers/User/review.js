const Product = require("@models/product")
const Review = require("@models/review")
const Order = require("@models/order")
const ReviewValidation = require("@middlewares/User/review")

const list = (req, res)=>{
    let filterQuery = {
        reviewer: req.user.id
    }
    Review.find(filterQuery).then(reviews=>{
        return res.json({
            success: true,
            data: reviews
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: err.message,
            error: err.errors
        })
    })
}

const add = (req, res)=>{
    let errors = ReviewValidation.add(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let review = new Review(req.body)
    review.reviewer = req.user.id
    
    Order.findOne({"products.product": review.product, status: 0}).then(ordered=>{
        if(!ordered){
            return res.json({
                success: false,
                message: "Product not ordered/placed to review"
            })
        }
        Review.findOne({product: review.product, reviewer: req.user.id}).then(reviewed=>{
            if(reviewed){
                return res.json({
                    success: false,
                    message: "Already reviewed this product"
                })
            }
            Product.findByIdAndUpdate(review.product, {$push: {reviews: review}}).then(updated=>{
                if(!updated){
                    return res.json({
                        success: false,
                        message: "No such product found"
                    })
                }
                review.save().then(saved=>{
                    return res.json({
                        success: true,
                        message: "Successfully added",
                        data: saved
                    })
                }).catch(err=>{
                    return res.json({
                        success: false,
                        message: err.message,
                        error: err.errors
                    })
                })
            }).catch(err=>{
                return res.json({
                    success: false,
                    message: err.message,
                    error: err.errors
                })
            })
        })
    })
}

remove = (req, res)=>{
    let filterQuery = {
        _id: req.params.id, 
        reviewer: req.user.id
    }
    
    Review.findOneAndDelete(filterQuery).then(deleted=>{
        if(!deleted){
            return res.json({
                success: false,
                message: "No such review found",
            })
        }
        Product.findByIdAndUpdate(deleted.product, {$pull: {reviews: req.params.id}}).then(updated=>{
            return res.json({
                success: true,
                message: "Successfully removed"
            })
        }).catch(err=>{
            return res.json({
                success: false,
                message: err.message,
                error: err.errors
            })
        })
            
    })
}

module.exports = {
    list,
    add,
    remove
}