const Site = require("@models/site")

const sliders = (req, res)=>{
    Site.findOne({}).then(site=>{
        res.json({
            featuredSlider: site.featuredSlider,
            categorySlider: site.categorySlider
        })
    })
}

module.exports = {
    sliders
}
