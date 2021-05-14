const jwt = require('jsonwebtoken')
const config = require('@config/config')
const sendEmail = require("@config/sendEmail")
const Vendor = require('@models/vendor')
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
    let filterQuery = {slug: req.params.slug}
    Vendor.findOne(filterQuery)
    .populate('products')
    .populate('orders')
    .then(vendor=>{
        if(!vendor)
        res.json({
            success: false,
            message: "No vendor found"
        })
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