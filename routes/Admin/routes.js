const express = require('express')
const router = express.Router()

const AdminAuthController = require('../../controllers/Admin/AdminAuth')
const OrderController = require('../../controllers/Order/order')

const authorize = require('../../middlewares/authorize')

router.post('/auth/signin', AdminAuthController.signin)
router.post('/auth/signup', AdminAuthController.signup)

router.use(authorize([1]))

// orders
router.get('/order/list', OrderController.list)

module.exports = router