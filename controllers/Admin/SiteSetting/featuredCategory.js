const WebSetting = require('@models/siteSetting')
const featuredCategoryValidation = require('@middlewares/Admin/SiteSetting/featuredCategoryValidation')


const info = (req, res)=>{
    WebSetting.findOne()
    .select('featuredCategory')
    .populate({
        path: 'featuredCategory.category',
        select: 'name slug icon',
        model: 'MainCategory'
    })
    .then(setting=>{
        console.log(setting.featuredCategory)
        return res.json({
            success: true,
            data: setting.featuredCategory
        })
    })
}

const update = (req, res)=>{
    let errors = featuredCategoryValidation.update(req.body)
    if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })
    let update = req.body
    WebSetting.findOneAndUpdate({featuredCategory: update}).then(webSetting=>{
        console.log(webSetting)
        return res.json({
            success: true,
            featuredCategory: webSetting.featuredCategory
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