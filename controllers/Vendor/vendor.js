const Vendor = require('../../models/vendor')

const list = (req, res)=>{

    let userType = null

    let selectQuery = null
    if(req.user)
        userType = req.user.userType

    if(userType === 3 || userType === null ){
        selectQuery = 'name'
    }
    
     
     Vendor.find()
     .select(selectQuery)
     .then(vendors=>{
          res.json({
               status: true,
               results: vendors.length,
               data: vendors
          })
     }).catch(err=>{
          res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

module.exports = {
     list
}