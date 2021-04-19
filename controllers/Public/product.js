const Product = require('../../models/product')

const list = (req, res)=>{
     Product.find({publish: true})
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
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const listById = (req, res)=>{
     let id = req.params.id
     Product.findOne({_id: id, publish: true})
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .then(product=>{
          res.json({
               status: true,
               data: product
          })
     }).catch(err=>{
          res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const listByVendor = (req, res)=>{
     let vendorId = req.params.id
     console.log("Vendor Products")
     Product.find({vendor: vendorId, publish: true})
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
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const listByMainCategory = (req, res)=>{
     let categoryId = req.params.id
     console.log("Main Category Products")
     Product.find({mainCategory: categoryId, publish: true})
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
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const listBySubCategory = (req, res)=>{
     let categoryId = req.params.id
     Product.find({subCategory: categoryId, publish: true})
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
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}
const listByChildCategory = (req, res)=>{
     let categoryId = req.params.id
     Product.find({childCategory: categoryId, publish: true})
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
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

module.exports = {
     list,
     listById,
     listByVendor,
     listByMainCategory,
     listBySubCategory,
     listByChildCategory,
}