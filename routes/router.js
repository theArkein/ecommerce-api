const adminRoutes = require('./Admin/routes')
const vendorRoutes = require('./Vendor/routes')
const userRoutes = require('./User/routes')
const publicRoutes = require('./Public/routes')


const config = require('@config/config.json')

const router = (app)=>{    
    // Admin
    app.use(`${config.base}/admin`, adminRoutes)

    // Vendor
    app.use(`${config.base}/vendor`, vendorRoutes)

    // User
    app.use(`${config.base}/user`, userRoutes)

    // Public
    app.use(`${config.base}/public`, publicRoutes)

}

module.exports = router