const WebSetting = require('@models/siteSetting')

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

}


module.exports = {
    info,
    update,
}