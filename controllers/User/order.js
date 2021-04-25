const Order = require('@models/order')
const uniqid = require('uniqid');

const list = (req, res)=>{
     let filterQuery = {user: req.user.id}
     Order.find(filterQuery)
     .then(orders=>{
          return res.json({
               status: true,
               results: orders.length,
               data: orders
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
     let filterQuery = {
          orderId : req.params.orderId
     }
     Order.findOne(filterQuery)
     .then(order=>{
          if(order.user!=req.user.id)
               return res.json({
                    status: false,
                    data: "User not authorized for this order"
               })
          return res.json({
               status: true,
               data: order
          })
     }).catch(err=>{
          return res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const create = (req, res)=>{
     let {vendor, products, shippingDetails, billingDetails} = req.body
     let totalCost = 0
     let totalProducts = 0
     products.forEach(product => {
          totalCost += product.totalCost
          totalProducts += product.quantity
     });
     let order = {
          orderId: uniqid(),
          totalProducts,
          totalCost,
          user: req.user.id,
          vendor,
          products,
          shippingDetails,
          billingDetails
     }

     let newOrder = new Order(order)
     console.log(newOrder)
     newOrder.save().then(created=>{
          res.json({
               status: true,
               message: "Successfully created",
               data: created
          })
     }).catch(err=>{
          res.json({
               status: false,
               message: err.message,
               errors: err.errors
          })
     })
}


module.exports = {
     list,
     detail,
     create,
}