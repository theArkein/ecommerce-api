const adminRoutes = require('./Admin/routes')
const vendorRoutes = require('./Vendor/routes')
const userRoutes = require('./User/routes')
const publicRoutes = require('./Public/routes')

const productRoutes = require('./Product/routes')
const orderRoutes = require('./Order/routes')


const config = require('../config/config.json')

const router = (app)=>{    
    // Admin
    app.use(`${config.base}/admin`, adminRoutes)

    // Admin
    app.use(`${config.base}/vendor`, vendorRoutes)

    // User
    app.use(`${config.base}/user`, userRoutes)

    // User
    app.use(`${config.base}/public`, publicRoutes)

    // Product
    app.use(`${config.base}/product`, productRoutes)

    // Order
    app.use(`${config.base}/order`, orderRoutes)
}

module.exports = router