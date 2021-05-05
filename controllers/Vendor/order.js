const Order = require('@models/order')

const list = (req, res)=>{
     let filterQuery = {vendor: req.user.id}
     Order.find(filterQuery)
     .then(orders=>{
          return res.json({
               success: true,
               results: orders.length,
               data: orders
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
     let filterQuery = {
          orderId : req.params.orderId,
     }
     Order.findOne(filterQuery)
     .then(order=>{
          if(order.vendor!=req.user.id)
               return res.json({
                    success: false,
                    message: "Vendor not authorized for this product"
               })
          return res.json({
               success: true,
               data: order
          })
     }).catch(err=>{
          return res.json({
               success: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const edit = (req, res)=>{
     let id = req.params.id
     Order.findByIdAndUpdate(id).then(updated=>{
          res.json({
               success: true,
               message: "Successfully updated",
               data: updated
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

module.exports = {
     list,
     detail,
     edit
}