const WebSetting = require('@models/siteSetting')

const info = (req, res)=>{
    WebSetting.findOne()
    .select('footer')
    .then(setting=>{
        console.log(setting)
        return res.json({
            success: true,
            data: setting.footer
        })
    })
}

const update = (req, res)=>{

}


module.exports = {
    info,
    update,
}