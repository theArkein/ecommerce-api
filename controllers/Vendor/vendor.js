const Vendor = require('../../models/vendor')
const Product = require('../../models/product')
const Order = require('../../models/product')


const listProducts = (req, res)=>{
     let vendorId = req.user.id
     Product.find({vendor: vendorId})
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

const listOrders = (req, res)=>{
     let vendorId = req.user.id
     Order.find({vendor: vendorId})
     .then(orders=>{
          res.json({
               status: true,
               results: orders.length,
               data: orders
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
     listProducts,
     listOrders
}