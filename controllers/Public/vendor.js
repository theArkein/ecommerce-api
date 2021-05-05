const Vendor = require('@models/vendor')

const list = (req, res)=>{
     let selectQuery = 'name'
     Vendor.find()
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

module.exports = {
     list
}