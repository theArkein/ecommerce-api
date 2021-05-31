const Order = require('@models/order')
const User = require('@models/user')

const sendEmail = require('@config/sendEmail')


const list = (req, res)=>{
     let filterQuery = {vendors: req.user.id}
     Order.find(filterQuery)
     .populate('products.product', 'name shortname image vendor')
     .then(orders=>{
          // res.json(orders)
          let vendorOrders = orders.map(order=>{
               let products = order.products.filter(item=>{
                    if(item.product.vendor == req.user.id)
                    return item
               })
               let totalProducts = totalCost = totalQuantity = 0
               products.forEach(element => {
                    totalQuantity += element.quantity
                    totalCost += element.totalCost
                    totalProducts++
               });
               let newOrder = {
                    orderId : order.orderId,
                    shippingAddress: order.shippingAddress,
                    status: order.status,
                    products,
                    totalProducts,
                    totalQuantity,
                    totalCost
               }
               return newOrder
          })
          return res.json({
               success: true,
               results: orders.length,
               data: vendorOrders
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
          vendors: req.user.id,
          orderId : req.params.orderId,
     }
     Order.findOne(filterQuery)
     .populate('products.product', 'name shortname image vendor')
     .then(order=>{

               let products = order.products.filter(item=>{
                    if(item.product.vendor == req.user.id)
                    return item
               })
               let totalProducts = totalCost = totalQuantity = 0
               products.forEach(element => {
                    totalQuantity += element.quantity
                    totalCost += element.totalCost
                    totalProducts++
               });
               let newOrder = {
                    orderId : order.orderId,
                    shippingAddress: order.shippingAddress,
                    status: order.status,
                    products,
                    totalProducts,
                    totalQuantity,
                    totalCost
               }
          return res.json({
               success: true,
               data: newOrder
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}

const cancel = (req, res)=>{
     let id = req.params.orderId
     let filterQuery = {vendor: req.user.id, orderId: id, status: {$nin: [2, 4, 5]} }
     Order.findOneAndUpdate(filterQuery, {status: 1}).then(updated=>{
          if(!updated){
               return res.json({
                    success: false,
                    message: "This order cannot be cancelled"
               })
          }
          User.findById(updated.user).then(user=>{
               sendEmail("Travel Right", `Your order with id: ${id} has been cancelled`, user.email)
          })
          return res.json({
               success: true,
               message: "Order successfully cancelled",
               data: updated
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const decline = (req, res)=>{
     let id = req.params.orderId
     let filterQuery = {vendor: req.user.id, orderId: id, status: {$nin: [1, 4, 5]} }
     Order.findOneAndUpdate(filterQuery, {status: 2}).then(updated=>{
          if(!updated){
               return res.json({
                    success: false,
                    message: "This order cannot be declined"
               })
          }
          User.findById(updated.user).then(user=>{
               sendEmail("Travel Right", `Your order with id: ${id} has been declined`, user.email)
          })
          return res.json({
               success: true,
               message: "Order successfully declined",
               data: updated
          })
     }).catch(err=>{
          return es.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const ship = (req, res)=>{
     let id = req.params.orderId
     let filterQuery = {vendor: req.user.id, orderId: id, status: 0} 
     Order.findOneAndUpdate(filterQuery, {status: 3}).then(updated=>{
          if(!updated){
               return res.json({
                    success: false,
                    message: "This order cannot be shipped",
               })
          }
          User.findById(updated.user).then(user=>{
               sendEmail("Travel Right", `Your order with id: ${id} has been shipped`, user.email)
          })
          return res.json({
               success: true,
               message: "Order successfully shipped",
               data: updated
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const complete = (req, res)=>{
     let id = req.params.orderId
     let filterQuery = {vendor: req.user.id, orderId: id, status: 3} 
     Order.findOneAndUpdate(filterQuery, {status: 4}).then(updated=>{
          if(!updated){
               return res.json({
                    success: false,
                    message: "This order cannot be completed"
               })
          }
          User.findById(updated.user).then(user=>{
               sendEmail("Travel Right", `Your order with id: ${id} has been completed`, user.email)
          })
          return res.json({
               success: true,
               message: "Order successfully completed",
               data: updated
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const refund = (req, res)=>{
     let id = req.params.orderId
     let filterQuery = {vendor: req.user.id, orderId: id, status: 4} 
     Order.findOneAndUpdate(filterQuery, {status: 5}).then(updated=>{
          if(!updated){
               return res.json({
                    success: false,
                    message: "This order cannot be refunded"
               })
          }
          User.findById(updated.user).then(user=>{
               sendEmail("Travel Right", `Your order with id: ${id} has been refunded`, user.email)
          })
          return res.json({
               success: true,
               message: "Order successfully refunded",
               data: updated
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

module.exports = {
     list,
     detail,
     cancel,
     decline,
     ship,
     complete,
     refund

}