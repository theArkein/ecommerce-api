const Product = require('@models/product')

const list = (req, res)=>{
     Product.find()
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
     let filterQuery = {slug : req.params.slug}
     Product.findOne(filterQuery)
     .then(product=>{
          if(!product)
               return res.json({
                    status: false,
                    message: "No product found"
               })
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

module.exports = {
     list,
     detail
}