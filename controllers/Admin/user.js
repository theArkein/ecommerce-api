const User = require('@models/user')

const list = (req, res)=>{
    User.find()
    .then(users=>{
         res.json({
              success: true,
              results: users.length,
              data: users
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
    let filterQuery = {id: req.params.id}
    User.findOne(filterQuery)
    .then(user=>{
        if(!user)
        res.json({
            success: false,
            message: "No user found"
        })
         res.json({
              success: true,
              results: users.length,
              data: users
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