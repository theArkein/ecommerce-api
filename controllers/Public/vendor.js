const Vendor = require('@models/vendor')

const list = (req, res)=>{
     let selectQuery = 'email profileDetails'
     Vendor.find({accountStatus: 2})
     .select(selectQuery)
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
     let filterQuery = {_id: req.params.id, accountStatus: 2}
     Vendor.findOne(filterQuery)
     .populate('products')
     .select('-orders')
     .then(vendor=>{
         if(!vendor)
         res.json({
             success: false,
             message: "No vendor found"
         })
          res.json({
               success: true,
               data: vendor
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
 }

module.exports = {
     list,
     detail
}