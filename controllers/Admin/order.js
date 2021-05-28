const Order = require('@models/order')
const User = require('@models/user')
const Vendor = require('@models/vendor')
const sendEmail = require('@config/sendEmail')

const uniqid = require('uniqid');

const list = (req, res)=>{
     Order.find()
     .then(orders=>{
          res.json({
               success: true,
               results: orders.length,
               data: orders
          })
     }).catch(err=>{
          res.json({
               success: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const detail = (req, res)=>{
     let filterQuery = {orderId : req.params.orderId}
     Order.findOne(filterQuery)
     .populate("products.product", 'shortname name image')
     .then(orders=>{
          res.json({
               success: true,
               results: orders.length,
               data: orders
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}

const cancel = (req, res)=>{
     let id = req.params.orderId
     let filterQuery = {orderId: id, status: {$nin: [2, 4, 5]} }
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
          Vendor.findById(updated.vendor).then(user=>{
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
     let filterQuery = {orderId: id, status: {$nin: [1, 4, 5]} }
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
          Vendor.findById(updated.vendor).then(user=>{
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
     let filterQuery = {orderId: id, status: 0} 
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
          Vendor.findById(updated.vendor).then(user=>{
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
     let filterQuery = {orderId: id, status: 3} 
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
          Vendor.findById(updated.vendor).then(user=>{
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
     let filterQuery = {orderId: id, status: 4} 
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
          Vendor.findById(updated.vendor).then(user=>{
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