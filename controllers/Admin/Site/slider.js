const ObjectID = require('mongodb').ObjectID

const Site = require("@models/site")
const config  = require('@config/config');
const sliderValidation = require('@middlewares/Admin/Site/slider')

const featuredSlidersInfo = (req, res)=>{
    Site.findOne({}).then(site=>{
        return res.json({
            success: true,
            featuredSlider: site.featuredSlider
        })
    })
}

const featuredSlidersUpdate = (req, res)=>{
    let errors = sliderValidation.featuredAdd(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let update = {
        featuredSlider: req.body
    }
    Site.findOneAndUpdate({}, update).then(site=>{
        return res.json({
            success: true,
            message: "Successfully updated"
        })
    })
}


const categorySlidersInfo = (req, res)=>{
    Site.findOne({}).then(site=>{
        return res.json({
            success: true,
            categorySlider: site.categorySlider
        })
    })
}

const categorySlidersAdd = (req, res)=>{
    let errors = sliderValidation.categoryAdd(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let slider = req.body
    slider.endpoint = `${config.production}${config.base}/public/product/category/main/${req.body}/list`
    let update = {
        $push: {
            categorySlider: slider
        }
    }
    Site.findOneAndUpdate({},update).then(site=>{
        return res.json({
            success: true,
            message: "Successfully added"
        })
    })
}

const categorySlidersUpdate = (req, res)=>{
    let errors = sliderValidation.categoryUpdate(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })
    let sliderId = req.params.id
    let slider = req.body

    let filterQuery = {
        "categorySlider._id": new ObjectID(sliderId)
    }
    console.log(filterQuery)

    let update = {
        $set: {
            "categorySlider.$.title": slider.title,
            "categorySlider.$.category": slider.category,
            "categorySlider.$.order": slider.order,
            "categorySlider.$.publish": slider.publish,
            "categorySlider.$.endpoint": `${config.production}${config.base}/public/product/category/main/${slider.category
            }/list`
        }
    }
    Site.findOneAndUpdate(filterQuery, update).then(site=>{
        if(!site){
            return res.json({
                success: false,
                message: "No such slider"
            })
        }
        return res.json({
            success: true,
            message: "Successfully updated"
        })
    })
}

const categorySlidersDelete = (req, res)=>{
    let sliderId = req.params.id
    let filterQuery = {
        "categorySlider._id": new ObjectID(sliderId)
    }
    let update = {
        $pull: {
            categorySlider: {
                _id: sliderId
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
    featuredSlidersInfo,
    featuredSlidersUpdate,
    categorySlidersInfo,
    categorySlidersAdd,
    categorySlidersUpdate,
    categorySlidersDelete
}