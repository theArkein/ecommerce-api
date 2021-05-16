const ObjectID = require('mongodb').ObjectID

const Site = require("@models/site")
const config  = require('@config/config');

const featuredSlidersInfo = (req, res)=>{
    Site.findOne({}).then(site=>{
        return res.json({
            success: true,
            featuredSlider: site.featuredSlider
        })
    })
}

const featuredSlidersUpdate = (req, res)=>{
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
    let slider = req.body
    slider.endpoint = `${config.production}${config.base}/public/product/category/main/60827c7d05e7260d69f10677/list`
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
    let sliderId = req.params.id
    let slider = req.body

    let filterQuery = {
        "categorySlider._id": new ObjectID(sliderId)
    }
    console.log(filterQuery)

    let update = {
        $set: {
            "categorySlider.$.title": slider.title
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
            message: "Successfully added"
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