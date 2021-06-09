const Setting = require("../Admin/../../models/setting")

// validators


const info = (req, res)=>{
    Setting.find({}).then(settings=>{
        res.json(settings)
    })
}

const add = (req, res)=>{
    let setting =new Setting(req.body)
    setting.save().then(saved=>{
        res.json(saved)
    })
}

const update = async (req, res)=>{
    let setting = await Setting.findById(req.params.id)
    setting.type = "RECOMMENDED_CATEGORY"
    setting.save().then(saved=>{
        res.json(saved)
    })
}

const remove = (req, res)=>{
    Setting.findByIdAndDelete(req.params.id).then(deleted=>{
        if(!deleted)
            res.json({
                success: false,
                message: "Failed to delete"
            })
        res.json({
            success: true,
            message: "Successfully deleted"
        })
    })
}

module.exports = {
    info,
    add,
    update, 
    remove
}