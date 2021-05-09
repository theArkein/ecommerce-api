const Product = require('@models/product')
const Vendor = require('@models/vendor')
const MainCategory = require('@models/mainCategory')
const SubCategory = require('@models/subCategory')
const ChildCategory = require('@models/childCategory')
const WebSetting = require('@models/siteSetting')
const Review = require('../../models/review')
const paginateOption = require("@config/paginateOption")


const list = (req, res)=>{
     let filterQuery = {publish: true}
     let options = paginateOption(req.query.page, req.query.limit)
     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          return res.json({
               success: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const detail = (req, res)=>{
     let filterQuery = {_id: req.params.id, publish: true}
     Product.findOne(filterQuery)
     .populate('mainCategory subCategory childCategory', 'name slug icon')
     // .populate('reviews reviews.reviewer comments comments.commenter', 'profileDetails.firstname profileDetails.lastname')
     .populate({
          path: 'reviews',
          populate: {
               path: 'reviewer',
               select: 'profileDetails.firstname profileDetails.lastname'
          }
     })
     .populate({
          path: 'comments',
          populate: {
               path: 'commenter',
               select: 'profileDetails.firstname profileDetails.lastname'
          }
     })
     .then(product=>{
          if(!product)
               return res.json({
                    success: false,
                    message: "No product found"
               })
          Product.findByIdAndUpdate(product._id, { $inc: { viewCounts: 1 }}).exec()
          return res.json({
               success: true,
               data: product
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: "Something went wrong n",
               error: err
          })
     })
}
const listByVendor = (req, res)=>{
     let filterQuery = {publish: true, vendor: req.params.id}
     let options = paginateOption(req.query.page, req.query.limit)
     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}
const listByMainCategory = (req, res)=>{
     let filterQuery = {publish: true, mainCategory: req.params.id}
     let options = paginateOption(req.query.page, req.query.limit)

     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}
const listBySubCategory = (req, res)=>{
     let filterQuery = {publish: true, subCategory: req.params.id}
     let options = paginateOption(req.query.page, req.query.limit)

     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}
const listByChildCategory = (req, res)=>{
     let filterQuery = {publish: true, childCategory: req.params.id}
     let options = paginateOption(req.query.page, req.query.limit)

     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}

const listLatest = (req, res)=>{
     let filterQuery = {publish: true}
     let options = paginateOption(req.query.page, req.query.limit)
     options.sort = { createdAt: -1}

     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}

const listMostViewed = (req, res)=>{
     let filterQuery = {publish: true}
     let options = paginateOption(req.query.page, req.query.limit)
     options.sort = { viewCounts: -1}

     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}

const listFlashDeal = (req, res)=>{
     let filterQuery = {publish: true}
     let options = paginateOption(req.query.page, req.query.limit)
     options.sort = { discountedPrice: -1}

     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          res.json({
               success: false,
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

const search = (req, res)=>{
     let filterQuery = { $text: { $search: req.query.query }}

     if(req.query.mainCategory)
          filterQuery.mainCategory = req.query.mainCategory

     let options = paginateOption(req.query.page, req.query.limit)

     Product.paginate(filterQuery, options)
     .then(response=>{
          response.results  = response.data.length
          response.success = true
          return res.json(response)
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
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
     search
}