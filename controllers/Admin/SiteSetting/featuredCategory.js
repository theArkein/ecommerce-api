const WebSetting = require('@models/siteSetting')
const Product = require('@models/product')


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

}

module.exports = {
    info,
    update,
}