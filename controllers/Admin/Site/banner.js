const uniqId = require('uniqid')
const ObjectID = require('mongodb').ObjectID
const Site = require('@models/site')
const bannerValidation = require('@middlewares/Admin/Site/banner')

const saveImage = require('@config/saveImage')
const deleteImage = require("@config/deleteImage")


const info = (req, res)=>{
    Site.findOne()
    .select('banner')
    .then(site=>{
        return res.json({
            success: true,
            data: site.banner
        })
    })
}

const largeInfo = (req, res)=>{
    Site.findOne()
    .select('banner')
    .then(site=>{
        return res.json({
            success: true,
            data: site.banner.large
        })
    })
}

const smallInfo = (req, res)=>{
    Site.findOne()
    .select('banner')
    .then(site=>{
        return res.json({
            success: true,
            data: site.banner.small
        })
    })
}

const largeUpdate = (req, res)=>{
    let errors = bannerValidation.updateLarge(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let update = {
        "banner.large.preTitle": req.body.preTitle,
        "banner.large.title": req.body.title,
        "banner.large.subTitle": req.body.subTitle,
        "banner.large.btnText": req.body.btnText,
        "banner.large.btnLink": req.body.btnLink,
        "banner.large.price": req.body.price,
        "banner.large.publish": req.body.publish
    }

    let imagePath = imageData = null
    if(req.body.image){ 
        imagePath = `images/banner/${uniqId()}.png`
        imageData = req.body.image
        update["banner.large.image"] = imagePath
    }

    Site.findOneAndUpdate(update).then(({banner})=>{
        if(req.body.image){
            deleteImage(banner.large.image)
            saveImage(imageData, imagePath)
        }
        return res.json({
            success: true,
            banner: "Successfully Updated"
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: err.message,
            errors: err.errors
        })
    })


}

const smallUpdate = (req, res)=>{
    let errors = bannerValidation.updateSmall(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let id = req.params.id
    let imageData = imagePath = null
    
    let update = {
        "banner.small.$.preTitle": req.body.preTitle,
        "banner.small.$.title": req.body.title,
        "banner.small.$.subTitle": req.body.subTitle,
        "banner.small.$.price": req.body.price,
        "banner.small.$.link": req.body.link,
        "banner.small.$.order": req.body.order,
        "banner.small.$.publish": req.body.publish,
    }

    if(req.body.image){
        imageData = req.body.image
        imagePath = `images/banner/${uniqId()}.png`
        update["banner.small.$.image"] = imagePath
    }
    let filterQuery = {
        "banner.small._id": new ObjectID(id)
    }

    Site.findOneAndUpdate(filterQuery, update).then(site=>{
        console.log(site)
        if(req.body.image){
            saveImage(imageData, imagePath)
            site.banner.small.forEach(element => {
                if(`${element._id}` == `${id}`)
                    deleteImage(element.image)
            });
        }
        if(!site){
            return res.json({
                success: false,
                message: "No such banner"
            })
        }
        return res.json({
            success: true,
            message: "Successfully updated"
        })
    })
}


module.exports = {
    info,
    largeInfo,
    smallInfo,
    largeUpdate,
    smallUpdate
}