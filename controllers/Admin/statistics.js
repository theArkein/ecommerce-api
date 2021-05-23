const Vendor = require('@models/vendor')
const Product = require('@models/product')
const Order = require('@models/order')
const User = require('@models/order')

let countProducts = (filterQuery)=>{
    return new Promise((resolve, reject)=>{
         Product.find(filterQuery).countDocuments((err, data)=>{
              if(err)
                   reject(err)
              resolve(data)
         })
    })
}

let countOrders = (filterQuery)=>{
    return new Promise((resolve, reject)=>{
         Order.find(filterQuery).countDocuments((err, data)=>{
              if(err)
                   reject(err)
              resolve(data)
         })
    })
}

let countVendors = (filterQuery)=>{
    return new Promise((resolve, reject)=>{
         Vendor.find(filterQuery).countDocuments((err, data)=>{
              if(err)
                   reject(err)
              resolve(data)
         })
    })
}

let countUsers = (filterQuery)=>{
    return new Promise((resolve, reject)=>{
         User.find(filterQuery).countDocuments((err, data)=>{
              if(err)
                   reject(err)
              resolve(data)
         })
    })
}

const info = async (req, res)=>{
    
    let totalProducts = countProducts({})
    let pendingProducts = countProducts({status: 1})
    let approvedProducts = countProducts({status: 2})
    let suspendedProducts = countProducts({status: 3})

    let totalOrders = countOrders({})
    let pendingOrders = countOrders({status: 0})
    let cancelledOrders = countOrders({status: 1})
    let declinedOrders = countOrders({status: 2})
    let shippedOrders = countOrders({status: 3})
    let completedOrders = countOrders({status: 4})
    let refundedOrders = countOrders({status: 5})
    let todaysOrders = countOrders({"orderedDate": { 
        $lt: new Date(), 
        $gte: new Date(new Date().setDate(new Date().getDate()-1))
    }})

    let totalUsers = countUsers({})
    let totalVendors = countVendors({})


    let statistics = await Promise.all([
        totalProducts, pendingProducts, approvedProducts, 
        suspendedProducts, totalOrders, pendingOrders, cancelledOrders, 
        declinedOrders, shippedOrders, completedOrders, refundedOrders, 
        todaysOrders, totalUsers, totalVendors])
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
              todaysOrders: statistics[11],
              totalVendors: statistics[12],
              totalUsers: statistics[13]
         }
    })
}


module.exports = {
    info
}