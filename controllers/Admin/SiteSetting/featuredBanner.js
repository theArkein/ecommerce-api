const WebSetting = require('@models/siteSetting')

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

}


module.exports = {
    info,
    update,
}