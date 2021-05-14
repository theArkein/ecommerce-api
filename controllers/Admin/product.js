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

module.exports = {
     list,
     detail,
     approve,
     suspend
}