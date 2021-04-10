const adminRoutes = require('./Admin/router')
const userRoutes = require('./User/router')
const categoryRoutes = require('./Category/routes')
const productRoutes = require('./Product/routes')
const orderRoutes = require('./Order/routes')


const config = require('../config/config.json')

const router = (app)=>{    
    // Admin
    app.use(`${config.base}/admin`, adminRoutes)

    // User
    app.use(`${config.base}/user`, userRoutes)

    // Product
    app.use(`${config.base}/product`, productRoutes)

    // Category
    app.use(`${config.base}/category`, categoryRoutes)

    // Order
    app.use(`${config.base}/order`, orderRoutes)
}

module.exports = router