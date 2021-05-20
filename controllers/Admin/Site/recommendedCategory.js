const ObjectID = require('mongodb').ObjectID
const uniqId = require('uniqid')
const Site = require("@models/site")
const config  = require('@config/config');
const recommendedCategoryValidation = require('@middlewares/Admin/Site/recommendedcategory')

const saveImage = require('@config/saveImage')
const deleteImage = require("@config/deleteImage")

const info = (req, res)=>{
    Site.findOne({}).then(site=>{
        return res.json({
            success: true,
            recommendedCategory: site.recommendedCategory
        })
    })
}

const add = (req, res)=>{
    let errors = recommendedCategoryValidation.add(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let recommended = req.body

    let imagePath = imageData = null
    recommended.endpoint = `${config.production}${config.base}/public/product/category/main/${req.body.category}/list`
    if(req.body.image){ 
        imagePath = `images/recommended-category/${uniqId()}.png`
        imageData = req.body.image
        recommended.image = imagePath
    }
    let update = {
        $push: {
            recommendedCategory: recommended
        }
    }
    Site.findOneAndUpdate({},update).then(site=>{
        if(req.body.image){
            saveImage(imageData, imagePath)
        }
        return res.json({
            success: true,
            message: "Successfully added"
        })
    })
}

const updateOne = (req, res)=>{
    let errors = recommendedCategoryValidation.update(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })
    let id = req.params.id
    let recommended = req.body

    let filterQuery = {
        "recommendedCategory._id": new ObjectID(id)
    }

    let update = {
        $set: {
            "recommendedCategory.$.title": recommended.title,
            "recommendedCategory.$.image": recommended.image,
            "recommendedCategory.$.category": recommended.category,
            "recommendedCategory.$.endpoint": `${config.production}${config.base}/public/product/category/main/${req.body.category}/list`
        }
    }

    if(req.body.image){
        imageData = req.body.image
        imagePath = `images/recommended-category/${uniqId()}.png`
        update["recommendedCategory.$.image"] = imagePath
    }

    Site.findOneAndUpdate(filterQuery, update).then(site=>{
        if(req.body.image){
            saveImage(imageData, imagePath)
            site.recommendedCategory.forEach(element => {
                if(`${element._id}` == `${id}`)
                    deleteImage(element.image)
            });
        }
        if(!site){
            return res.json({
                success: false,
                message: "No such id"
            })
        }
        return res.json({
            success: true,
            message: "Successfully updated"
        })
    })
}

const deleteOne = (req, res)=>{
    let id = req.params.id
    let filterQuery = {
        "recommendedCategory._id": new ObjectID(id)
    }
    let update = {
        $pull: {
            recommendedCategory: {
                _id: id
            }
        }
    }
    Site.findOneAndUpdate(filterQuery, update).then(site=>{
        return res.json({
            success: true,
            message: "Successfully deleted"
        })
    })
}

module.exports = {
    info,
    add,
    updateOne,
    deleteOne,
}