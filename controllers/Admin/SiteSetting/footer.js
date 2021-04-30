const WebSetting = require('@models/siteSetting')

const info = (req, res)=>{
    WebSetting.findOne()
    .select('featuredAds')
    .then(setting=>{
        console.log(setting)
        return res.json({
            success: true,
            data: setting.featuredAds
        })
    })
}

const update = (req, res)=>{

}


module.exports = {
    info,
    update,
}