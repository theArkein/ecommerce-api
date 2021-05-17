// const WebSetting = require('@models/siteSetting')
// const featuredBannerValidation = require('@middlewares/Admin/SiteSetting/featuredBannerValidation')
// const saveImage = require('@config/saveImage')
// const uniqId = require('uniqid')
// const deleteImage = require("@config/deleteImage")


// const info = (req, res)=>{
//     WebSetting.findOne()
//     .select('featuredBanner')
//     .then(setting=>{
//         console.log(setting.featuredBanner)
//         return res.json({
//             success: true,
//             data: setting.featuredBanner
//         })
//     })
// }

// const update = (req, res)=>{
//     let errors = featuredBannerValidation.update(req.body)
//     if(errors)
//         return res.json({
//             success: false,
//             message: "Validation failed",
//             errors
//         })
//     console.log(req.body)
//     let update = req.body

//     // Save Images and path

//     try {
//         let img1 = `images/site/banner/${uniqId()}${uniqId()}.png`
//         saveImage(update.large.image, img1)
//         update.large.image = img1

//         let img2 = `images/site/banner/${uniqId()}${uniqId()}.png`
//         saveImage(update.small[0].image, img2)
//         update.small[0].image = img2

//         let img3 = `images/site/banner/${uniqId()}${uniqId()}.png`
//         saveImage(update.small[1].image, img3)
//         update.small[1].image = img3

//         let img4 = `images/site/banner/${uniqId()}${uniqId()}.png`
//         saveImage(update.small[3].image, img4)
//         update.small[2].image = img4

//         let img5 = `images/site/banner/${uniqId()}${uniqId()}.png`
//         saveImage(update.small[3].image, img5)
//         update.small[3].image = img5
        
//     } catch(err) {
//         return res.json({
//             success: false,
//             message: "Could not save image"
//         })
//     }

//     console.log(update)

//     WebSetting.findOneAndUpdate({featuredBanner: update}).then(({featuredBanner})=>{
//         deleteImage(featuredBanner.large.image)
//         deleteImage(featuredBanner.small[0].image)
//         deleteImage(featuredBanner.small[1].image)
//         deleteImage(featuredBanner.small[2].image)
//         deleteImage(featuredBanner.small[3].image,)
//         return res.json({
//             success: true,
//             featuredBanner: featuredBanner
//         })
//     }).catch(err=>{
//         return res.json({
//             success: false,
//             message: err.message,
//             errors: err.errors
//         })
//     })
// }


// module.exports = {
//     info,
//     update,
// }