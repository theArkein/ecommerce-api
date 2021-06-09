const Site = require("@models/site")
const Setting = require("@models/setting")


const sliders = (req, res)=>{
    Site.findOne({}).then(site=>{
        res.json({
            featuredSlider: site.featuredSlider,
            categorySlider: site.categorySlider
        })
    })
}

const recommended = (req, res)=>{
    Setting.find({type: "RECOMMENDED_CATEGORY"})
    .then(items=>{
        items = items.map(item=>item.content)
        res.json({
            success: true,
            recommended: items
        })
    })
}

const banner = async (req, res)=>{
    let largeBanners = await Setting.find({type: "LARGE_BANNER"})
    largeBanners = largeBanners.map(banner=>banner.content)

    let smallBanners = await Setting.find({type: "SMALL_BANNER"})
    smallBanners = smallBanners.map(banner=>banner.content)

    res.json({
        success: true,
        data: {
            large: largeBanners,
            small: smallBanners
        }
    })
    
}

const ads = (req, res)=>{
    Setting.find({type: "ADS"})
    .then(ads=>{
        ads = ads.map(ad=>ad.content)
        res.json({
            success: true,
            ads
        })
    })
}

module.exports = {
    sliders,
    recommended,
    banner,
    ads
}
