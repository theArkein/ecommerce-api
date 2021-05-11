const Vendor = require('@models/vendor')
const Product = require('@models/product')
const Order = require('@models/order')

let fetchProducts = (filterQuery)=>{
     return new Promise((resolve, reject)=>{
          Product.find(filterQuery).countDocuments((err, data)=>{
               if(err)
                    reject(err)
               resolve(data)
          })
     })
}

let fetchOrders = (filterQuery)=>{
     return new Promise((resolve, reject)=>{
          Order.find(filterQuery).countDocuments((err, data)=>{
               if(err)
                    reject(err)
               resolve(data)
          })
     })
}

const statistics = async (req, res)=>{
     
     let totalProducts = fetchProducts({})
     let pendingProducts = fetchProducts({status: 1})
     let approvedProducts = fetchProducts({status: 2})
     let suspendedProducts = fetchProducts({status: 3})

     let totalOrders = fetchOrders({vendor: req.user.id})
     let pendingOrders = fetchOrders({vendor: req.user.id, status: 0})
     let cancelledOrders = fetchOrders({vendor: req.user.id, status: 1})
     let declinedOrders = fetchOrders({vendor: req.user.id, status: 2})
     let shippedOrders = fetchOrders({vendor: req.user.id, status: 3})
     let completedOrders = fetchOrders({vendor: req.user.id, status: 4})
     let refundedOrders = fetchOrders({vendor: req.user.id, status: 5})

     let todaysOrders = fetchOrders({"orderedDate": { $lt: new Date()}})



     let statistics = await Promise.all([totalProducts, pendingProducts, approvedProducts, suspendedProducts, totalOrders, pendingOrders, cancelledOrders, declinedOrders, shippedOrders, completedOrders, refundedOrders], todaysOrders)
     return res.json({
          succes: true,
          data: {
               totalProducts: statistics[0],
               pendingProducts: statistics[1],
               approvedProducts: statistics[2],
               suspendedProducts: statistics[3],
               totalOrders: statistics[4],
               pendingOrders: statistics[5],
               cancelledOrders: statistics[6],
               declinedOrders: statistics[7],
               shippedOrders: statistics[8],
               completedOrders: statistics[9],
               refundedOrders: statistics[10],
               todaysOrders: statistics[11]
          }
     })
}

// const statistic = async (req, res)=>{
//      let products = new Promise((resolve, reject)=>{
//           Product.find({}).exec((err, data)=>{
//                if(err)
//                     reject(err)
//                resolve(data)
//           })
//      })

//      let orders = new Promise((resolve, reject)=>{
//           Order.find({}).exec((err, data)=>{
//                if(err)
//                     reject(err)
//                resolve(data)
//           })
//      })

     

//      promises = await Promise.all([products, orders])
//      let pendingProducts = promises[0].filter(item=>{
//           if(item.status == 1)
//           return item
//      })
//      let approvedProducts = promises[0].filter(item=>{
//           if(item.status == 2)
//           return item
//      })
//      let suspendedProducts = promises[0].filter(item=>{
//           if(item.status == 3)
//           return item
//      })

//      res.json({
//           totalProducts: products.length,
//           pendingProducts: pendingProducts.length,
//           approvedProducts: approvedProducts.length,
//           suspendedProducts: suspendedProducts.length,

//      })
// }

module.exports = {
     statistics
}