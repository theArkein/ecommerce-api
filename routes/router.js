let productsRoutes = require('./products')
let config = require('../config/config.json')

let router = (app)=>{
    app.use(`${config.baseurl}/products`, productsRoutes)
}

module.exports = router