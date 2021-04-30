const Product = require('@models/product')
const Vendor = require('@models/vendor')
const MainCategory = require('@models/mainCategory')
const SubCategory = require('@models/subCategory')
const ChildCategory = require('@models/childCategory')
const WebSetting = require('@models/siteSetting')


const list = (req, res)=>{
     let filterQuery = {publish: true}
     Product.find()
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .then(products=>{
          return res.json({
               status: true,
               results: products.length,
               data: products
          })
     }).catch(err=>{
          return res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const detail = (req, res)=>{
     let filterQuery = {slug: req.params.slug, publish: true}
     Product.findOne(filterQuery)
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .then(product=>{
          if(!product)
               return res.json({
                    status: false,
                    message: "No product found"
               })
          Product.findByIdAndUpdate(product._id, { $inc: { viewCounts: 1 }}).exec()
          return res.json({
               status: true,
               data: product
          })
     }).catch(err=>{
          return res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const listByVendor = (req, res)=>{
     let filterQuery = {slug: req.params.slug}
     let selectQuery = 'products'
     Vendor.findOne(filterQuery)
     .select(selectQuery)
     .populate({
          path: 'products',
          populate: {
               path: 'mainCategory',
               select: 'name slug icon'
          },
          populate: {
               path: 'subCategory',
               select: 'name slug'
          },
          populate: {
               path: 'childCategory',
               select: 'name slug'
          }

     })
     .then(vendor=>{
          console.log(vendor)
          res.json({
               status: true,
               results: vendor.products.length,
               data: vendor.products
          })
     }).catch(err=>{
          res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const listByMainCategory = (req, res)=>{
     MainCategory.findOne({slug: req.params.slug}).then(category=>{
          if(!category)
               return res.json({
                    success: false,
                    message: "no such category found"
               })
          let filterQuery = {mainCategory: category._id, publish: true}
          Product.find(filterQuery)
          .populate('mainCategory', 'name slug icon')
          .populate('subCategory', 'name slug')
          .populate('childCategory', 'name slug')
          .then(products=>{
               res.json({
                    status: true,
                    results: products.length,
                    data: products
               })
          }).catch(err=>{
               res.json({
                    status: false,
                    message: "Something went wrong",
                    error: err
               })
          })
     })
}
const listBySubCategory = (req, res)=>{
     SubCategory.findOne({slug: req.params.slug}).then(category=>{
          if(!category)
               return res.json({
                    success: false,
                    message: "no such category found"
               })
          let filterQuery = {subCategory: category._id, publish: true}
          Product.find(filterQuery)
          .populate('mainCategory', 'name slug icon')
          .populate('subCategory', 'name slug')
          .populate('childCategory', 'name slug')
          .then(products=>{
               res.json({
                    status: true,
                    results: products.length,
                    data: products
               })
          }).catch(err=>{
               res.json({
                    status: false,
                    message: "Something went wrong",
                    error: err
               })
          })
     })
}
const listByChildCategory = (req, res)=>{
     ChildCategory.findOne({slug: req.params.slug}).then(category=>{
          if(!category)
               return res.json({
                    success: false,
                    message: "no such category found"
               })
          let filterQuery = {childCategory: category._id, publish: true}
          Product.find(filterQuery)
          .populate('mainCategory', 'name slug icon')
          .populate('subCategory', 'name slug')
          .populate('childCategory', 'name slug')
          .then(products=>{
               res.json({
                    status: true,
                    results: products.length,
                    data: products
               })
          }).catch(err=>{
               res.json({
                    status: false,
                    message: "Something went wrong",
                    error: err
               })
          })
     })
}

const listLatest = (req, res)=>{
     let filterQuery = {publish: true}
     Product.find(filterQuery)
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .sort({createdAt: -1})
     .limit(18)
     .then(products=>{
          return res.json({
               status: true,
               results: products.length,
               data: products
          })
     }).catch(err=>{
          return res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const listMostViewed = (req, res)=>{
     let filterQuery = {publish: true}
     Product.find(filterQuery)
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .sort({viewCounts: -1})
     .limit(18)
     .then(products=>{
          return res.json({
               status: true,
               results: products.length,
               data: products
          })
     }).catch(err=>{
          return res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const listFlashDeal = (req, res)=>{
     let filterQuery = {publish: true}
     Product.find(filterQuery)
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .sort({discountedPrice: 1})
     .limit(18)
     .then(products=>{
          return res.json({
               status: true,
               results: products.length,
               data: products
          })
     }).catch(err=>{
          return res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const listFeaturedCategory = (req, res)=>{
     WebSetting.findOne()
    .select('featuredCategory')
    .populate({
        path: 'featuredCategory.category',
        select: 'name slug icon',
        model: 'MainCategory'
    })
    .then(async setting=>{
         let featuredCategory = setting.featuredCategory.toObject()
         let promise = await featuredCategory.map(async item=>{
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
              return res.json({
                   success: true,
                   data
              })
         })

    })
}

const listRecommendedCategory = (req, res)=>{
     WebSetting.findOne()
    .then(async setting=>{
         setting = setting.toObject()
         console.log(setting)
         let recommendedCategory = setting.recommendedCategory
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
              return res.json({
                   success: true,
                   data
              })
         })
    })
}

module.exports = {
     list,
     detail,
     listByVendor,
     listByMainCategory,
     listBySubCategory,
     listByChildCategory,
     listLatest,
     listMostViewed,
     listFlashDeal,
     listFeaturedCategory,
     listRecommendedCategory,
}