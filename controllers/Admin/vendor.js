const jwt = require('jsonwebtoken')
const config = require('@config/config')
const sendEmail = require("@config/sendEmail")
const Vendor = require('@models/vendor')
const Order = require('@models/order')

const list = (req, res)=>{
    Vendor.find()
    .then(vendors=>{
         res.json({
              success: true,
              results: vendors.length,
              data: vendors
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
    let filterQuery = {_id: req.params.id}
    Vendor.findOne(filterQuery)
    .select('-password')
    .populate('products')
    .then(vendor=>{
        if(!vendor)
        res.json({
            success: false,
            message: "No vendor found"
        })
        filterQuery = {vendors: req.params.id}
        Order.find(filterQuery)
        .populate('products.product', 'name shortname image vendor')
        .then(orders=>{
            // res.json(orders)
            let vendorOrders = orders.map(order=>{
                let products = order.products.filter(item=>{
                        if(item.product.vendor == req.params.id)
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
            vendor = vendor.toObject()
            vendor.orders = vendorOrders
            res.json({
                success: true,
                data: vendor
           })
        })
    }).catch(err=>{
         res.json({
              success: false,
              message: "Something went wrong",
              error: err
         })
    })
}

const approve = (req, res)=>{
     let vendorId = req.params.id
     Vendor.findByIdAndUpdate(vendorId, {accountStatus: 2}).then(updated=>{
         if(!updated){
             return res.json({
                 success: false,
                 message: "Vendor doesnot exists or deleted",
             })
         }
         sendEmail("Travel Right Account approved", "Your account is approved by admin. Start adding products and selling", updated.email)
         return res.json({
             success:true,
             message: "Vendor successfully approved"
         })
     }).catch(err=>{
         return res.json({
             success:false,
             message: "Something went wrong"
         })
     })
 }
 
 const suspend = (req, res)=>{
    let vendorId = req.params.id
    Vendor.findByIdAndUpdate(vendorId, {accountStatus: 3}).then(updated=>{
        if(!updated){
            return res.json({
                success: false,
                message: "Vendor doesnot exists or deleted",
            })
        }
        sendEmail("Travel Right Account suspended", "Your account is suspended by admin.", updated.email)
        return res.json({
            success:true,
            message: "Vendor successfully suspended"
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