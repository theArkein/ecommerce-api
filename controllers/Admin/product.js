const Product = require('@models/product')
const Vendor = require('@models/vendor')
const sendEmail = require('@config/sendEmail')

const list = (req, res)=>{
     Product.find()
     .populate('mainCategory childCategory subCategory')
     .then(products=>{
          return res.json({
               success: true,
               results: products.length,
               data: products
          })
     }).catch(err=>{
          return res.json({
               success: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const detail = (req, res)=>{
     let filterQuery = {slug : req.params.slug}
     Product.findOne(filterQuery)
     .then(product=>{
          if(!product)
               return res.json({
                    success: false,
                    message: "No product found"
               })
          return res.json({
               success: true,
               data: product
          })
     }).catch(err=>{
          return res.json({
               success: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const approve = (req, res)=>{
     let productId = req.params.id
     Product.findByIdAndUpdate(productId, {status: 2}).then(updated=>{
         if(!updated){
             return res.json({
                 success: false,
                 message: "Vendor doesnot exists or deleted",
             })
         }
         Vendor.findById(updated.vendor).then(vendor=>{
              sendEmail(`Product approved`, `Congratulations, your product '${updated.name}' has been approved by admin`, vendor.email)
         })
         return res.json({
             success:true,
             message: "Product successfully approved"
         })
     }).catch(err=>{
          console.log(err)
         return res.json({
             success:false,
             message: "Something went wrong"
         })
     })
 }
 
 const suspend = (req, res)=>{
    let productId = req.params.id
    Product.findByIdAndUpdate(productId, {status: 3}).then(updated=>{
        if(!updated){
            return res.json({
                success: false,
                message: "Product doesnot exists or deleted",
            })
        }
        Vendor.findById(updated.vendor).then(vendor=>{
          sendEmail(`product suspended`, `Your product '${updated.name}' is suspended by admin`, vendor.email)
        })
        return res.json({
            success:true,
            message: "Product successfully suspended"
        })
    }).catch(err=>{
        return res.json({
            success:false,
            message: "Something went wrong"
        })
    })
}

const listByVendor = (req, res)=>{
     let filterQuery = {vendor: req.params.id}
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
     let filterQuery = {mainCategory: req.params.id}
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
     let filterQuery = {subCategory: req.params.id}
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
     let filterQuery = {childCategory: req.params.id}
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
     let filterQuery = {}
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
     let filterQuery = {}
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
     let filterQuery = {publish: true, status: 2}
     let options = paginateOption(req.query.page, req.query.limit)
     options.sort = { discount: -1}

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


const search = (req, res)=>{
     let filterQuery = { $text: { $search: req.query.query }}

     if(req.query.mainCategory)
          filterQuery.mainCategory = req.query.mainCategory
     if(req.query.subCategory)
          filterQuery.subCategory = req.query.subCategory
     if(req.query.childCategory)
          filterQuery.childCategory = req.query.childCategory
          
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
     approve,
     suspend,
     listByVendor,
     listByMainCategory,
     listBySubCategory,
     listByChildCategory,
     listLatest,
     listMostViewed,
     listFlashDeal,
     search,
}