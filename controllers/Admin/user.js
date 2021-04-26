const User = require('@models/user')

const list = (req, res)=>{
    User.find()
    .then(users=>{
         res.json({
              status: true,
              results: users.length,
              data: users
         })
    }).catch(err=>{
         res.json({
              status: true,
              message: "Something went wrong",
              error: err
         })
    })
}

const detail = (req, res)=>{
    let filterQuery = {slug: req.params.slug}
    User.findOne(filterQuery)
    .then(user=>{
        if(!user)
        res.json({
            status: false,
            message: "No user found"
        })
         res.json({
              status: true,
              results: users.length,
              data: users
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
    list,
    detail
}