const Site = require("@models/site")

const sliders = (req, res)=>{
    Site.findOne({}).then(site=>{
        res.json({
            featuredSlider: site.featuredSlider,
            categorySlider: site.categorySlider
        })
    })
}

const recommended = (req, res)=>{
    Site.findOne({})
    .populate('recommendedCategory.category', "name slug icon")
    .then(site=>{
        res.json({
            recommended: site.recommendedCategory
        })
    })
}

const banner = (req, res)=>{
    Site.findOne({})
    .then(site=>{
        res.json({
            banner: site.banner
        })
    })
}

const ads = (req, res)=>{
    Site.findOne({})
    .then(site=>{
        res.json({
            ads: site.ads
        })
    })
}

module.exports = {
    sliders,
    recommended,
    banner,
    ads
}
