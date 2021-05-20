const ObjectID = require('mongodb').ObjectID
const uniqid = require('uniqid')
const Site = require("../../../models/site")
const config  = require('@config/config');

const saveImage  = require('@config/saveImage');
const deleteImage  = require('@config/deleteImage');
const adValidation = require('@middlewares/Admin/Site/ad')



const adInfo = (req, res)=>{
    Site.findOne({}).then(site=>{
        return res.json({
            success: true,
            ads: site.ads
        })
    })
}

const adAdd = (req, res)=>{
    let errors = adValidation.add(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let ad = req.body
    let imageData = ad.image
    let imagePath = `images/ads/${uniqid()}.png`
    ad.image = imagePath

    let add = {
        $push: {
            ads: ad
        }
    }
    Site.findOneAndUpdate({}, add).then(site=>{
        saveImage(imageData, imagePath)
        return res.json({
            success: true,
            message: "Successfully added"
        })
    })

}

const adUpdate = (req, res)=>{
    let errors = adValidation.update(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let adId = req.params.id
    let ad = req.body

    let imageData = imagePath = null
    let update = {
        $set: {
            "ads.$.title": ad.title,
            "ads.$.btnText": ad.btnText,
            "ads.$.link": ad.link,
            "ads.$.order": ad.order,
            "ads.$.publish": ad.publish,
        }
    }
    if(ad.image){
        imageData = ad.image
        imagePath = `images/ads/${uniqid()}.png`
        update["ads.$.image"] = ad.image
    }
    let filterQuery = {
        "ads._id": new ObjectID(adId)
    }

    Site.findOneAndUpdate(filterQuery, update).then(site=>{
        if(ad.image){
            saveImage(imageData, imagePath)
            site.ads.forEach(element => {
                if(`${element._id}` == `${adId}`)
                    deleteImage(element.image)
            });
        }
        if(!site){
            return res.json({
                success: false,
                message: "No such ad"
            })
        }
        return res.json({
            success: true,
            message: "Successfully updated"
        })
    })
}

const adDelete = (req, res)=>{
    let adId = req.params.id
    let filterQuery = {
        "ads._id": new ObjectID(adId)
    }
    let update = {
        $pull: {
            ads: {
                _id: adId
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
    adInfo,
    adAdd,
    adUpdate,
    adDelete
}