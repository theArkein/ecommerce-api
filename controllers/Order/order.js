const Order = require('../../models/order')
const uniqid = require('uniqid');

const list = (req, res)=>{
     Order.find()
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

const listById = (req, res)=>{
     let id = req.params.id
     Order.findOne({_id: id})
     .then(order=>{
          res.json({
               status: true,
               data: order
          })
     }).catch(err=>{
          res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const create = (req, res)=>{
     let order = req.body
     console.log(req.body)
     order.id = uniqid()
     let newOrder = new Order(order)
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

const edit = (req, res)=>{
     let id = req.params.id
     Order.findByIdAndUpdate(id).then(updated=>{
          res.json({
               status: true,
               message: "Successfully updated",
               data: updated
          })
     }).catch(err=>{
          res.json({
               status: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const removeOne = (req, res)=>{
     let id = req.params.id
     console.log("Remove One")
     Order.findByIdAndRemove(id).then(deleted=>{             
          res.json({
               status: true,
               message: "Successfully deleted",
               deleted
          })
     }).catch(err=>{
          res.json({
               status: false,
               message: "Something went wrong",
          })
     })
}

const removeAll = (req, res)=>{
     console.log("Remove All")
     Order.deleteMany({}).then(data=>{
          console.log("All orders deleted")
          res.json(data)
     }).catch(err=>{
          console.log(err)
     })
}

module.exports = {
     list,
     listById,
     create,
     edit,
     removeOne,
     removeAll
}