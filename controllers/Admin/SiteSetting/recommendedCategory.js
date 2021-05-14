const uniqid = require('uniqid')
const saveImage = require('@config/saveImage')
const deleteImage = require('@config/deleteImage')
const WebSetting = require('@models/siteSetting')
const recommendedCategoryValidation = require('@middlewares/Admin/SiteSetting/recommendedCategoryValidation')

const info = (req, res)=>{
    WebSetting.findOne()
    .select('recommendedCategory')
    .populate({
        path: 'recommendedCategory.category',
        select: 'name slug icon',
        model: 'MainCategory'
    })
    .then(setting=>{
        console.log(setting.recommendedCategory)
        return res.json({
            success: true,
            data: setting.recommendedCategory
        })
    })
}

const update = (req, res)=>{
    let errors = recommendedCategoryValidation.update(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

    let update = req.body

    update.map(item=>{
        let img1 = `images/site/recommended/${uniqid()}${uniqid()}.png`
        saveImage(item.image, img1)
        item.image = img1
        return item
    })

    WebSetting.findOneAndUpdate({recommendedCategory: update}).then(webSetting=>{
        webSetting.recommendedCategory.forEach(element => {
            deleteImage(element.image)
        })
        return res.json({
            success: true,
            message: "Successfully updated"
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: "Failed to update",
            error: err.errors
        })
    })
}


module.exports = {
    info,
    update,
}