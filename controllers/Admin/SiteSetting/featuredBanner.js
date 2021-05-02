const WebSetting = require('@models/siteSetting')
const featuredBannerValidation = require('@middlewares/Admin/SiteSetting/featuredBannerValidation')
const saveImage = require('@config/saveImage')
const uniqId = require('uniqid')
const fs = require('fs')


const info = (req, res)=>{
    WebSetting.findOne()
    .select('featuredBanner')
    .then(setting=>{
        console.log(setting.featuredBanner)
        return res.json({
            success: true,
            data: setting.featuredBanner
        })
    })
}

const update = (req, res)=>{
    let errors = featuredBannerValidation.update(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
    console.log(req.body)
    let update = req.body

    // Save Images and path

    try {
        let img1 = `images/site/banner/${uniqId()}${uniqId()}.jpg`
        saveImage(update.large.image, img1)
        update.large.image = img1

        let img2 = `images/site/banner/${uniqId()}${uniqId()}.jpg`
        saveImage(update.small[0].image, img2)
        update.small[0].image = img2

        let img3 = `images/site/banner/${uniqId()}${uniqId()}.jpg`
        saveImage(update.small[1].image, img3)
        update.small[1].image = img3

        let img4 = `images/site/banner/${uniqId()}${uniqId()}.jpg`
        saveImage(update.small[3].image, img4)
        update.small[2].image = img4

        let img5 = `images/site/banner/${uniqId()}${uniqId()}.jpg`
        saveImage(update.small[3].image, img5)
        update.small[3].image = img5
        
    } catch(err) {
        return res.json({
            success: false,
            message: "Could not save image"
        })
    }

    console.log(update)

    WebSetting.findOneAndUpdate({featuredBanner: update}).then(({featuredBanner})=>{
        fs.unlink(featuredBanner.large.image, (err)=>{
            if(err)
                console.log("Couln't delete prvious banner image")
        })
        fs.unlink(featuredBanner.small[0].image, (err)=>{
            if(err)
                console.log("Couln't delete prvious banner image")
        })
        fs.unlink(featuredBanner.small[1].image, (err)=>{
            if(err)
                console.log("Couln't delete prvious banner image")
        })
        fs.unlink(featuredBanner.small[2].image, (err)=>{
            if(err)
                console.log("Couln't delete prvious banner image")
        })
        fs.unlink(featuredBanner.small[3].image, (err)=>{
            if(err)
                console.log("Couln't delete prvious banner image")
        })
        return res.json({
            success: true,
            featuredBanner: featuredBanner
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: err.message,
            errors: err.errors
        })
    })
}


module.exports = {
    info,
    update,
}