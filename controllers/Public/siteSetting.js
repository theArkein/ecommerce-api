const WebSetting = require('@models/siteSetting')
const Product = require('@models/product')

const banner = (req, res)=>{
    WebSetting.findOne()
    .select('featuredBanner')
    .then(setting=>{
        let checkedFeaturedBanner = setting.featuredBanner.toObject()
        if(!checkedFeaturedBanner.large.active)
            checkedFeaturedBanner.large = null
        
        for(let i=0; i<checkedFeaturedBanner.small.length; i++){
            if(!checkedFeaturedBanner.small[i].active)
                checkedFeaturedBanner.small[i] = null
        }
        return res.json({
            success: true,
            data: checkedFeaturedBanner
        })
    })
}

const slider = (req, res)=>{
    WebSetting.findOne()
    .select('featuredCategory')
    .populate({
        path: 'featuredCategory.category',
        select: 'name slug icon',
        model: 'MainCategory'
    })
    .then(async setting=>{
         let featuredCategory = setting.featuredCategory.toObject()
         
         let featuredCategoryArray = [featuredCategory.A, featuredCategory.B, featuredCategory.C]
         let promise = await featuredCategoryArray.map(async item=>{
              if(item.active && item.category){
                   let filterQuery = {
                        publish: true,
                        mainCategory: item.category
                   }
                    let products = await Product.find(filterQuery).sort({createdAt: -1}).limit(18)
                    item.products = products
                    return item
               }
         })
         Promise.all(promise).then(data=>{
              return res.json({
                   success: true,
                   data: {
                       A: data[0],
                       B: data[1],
                       C: data[2],
                   }
              })
         })
    })
}

const recommended = (req, res)=>{
    WebSetting.findOne()
    .select('recommendedCategory')
    .populate({
        path: 'recommendedCategory.category',
        select: 'name slug icon',
        model: 'MainCategory'
    })
    .then(async setting=>{
         let recommendedCategory = setting.recommendedCategory.toObject()
         let promise = await recommendedCategory.map(async item=>{
              if(item.active && item.category){
                   let filterQuery = {
                        publish: true,
                        mainCategory: item.category
                   }
                    let products = await Product.find(filterQuery)
                    item.products = products
                    return item
               }
         })
         Promise.all(promise).then(data=>{
                var filtered = data.filter(item=>{
                    return item!=null
                })
              return res.json({
                   success: true,
                   data: filtered
              })
         })

    })
}
module.exports = {
    banner,
    slider,
    recommended
}