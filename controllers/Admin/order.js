const Order = require('@models/order')
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

module.exports = {
     list,
     detail
}