let productsRoutes = require('./Product/routes')
let adminRoutes = require('./Admin/router')
let userRoutes = require('./User/router')



let config = require('../config/config.json')

let router = (app)=>{
    // Products
    app.use(`${config.baseurl}/products`, productsRoutes)

    // Admin
    app.use(`${config.baseurl}/admin`, adminRoutes)

    // User
    app.use(`${config.baseurl}/user`, userRoutes)

}

module.exports = router