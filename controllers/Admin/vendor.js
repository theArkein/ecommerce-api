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


module.exports = {
    list,
    detail
}