const express = require('express')
const router = express.Router()

const UserAuthController = require('@controllers/User/UserAuth')
const OrderController = require('@controllers/User/order')

const authorize = require('@middlewares/authorize')

router.post('/auth/signin', UserAuthController.signin)
router.post('/auth/signup', UserAuthController.signup)

// orders
router.get('/order/list', authorize([3]), OrderController.list)
router.get('/order/:orderId/detail', authorize([3]), OrderController.detail)
router.post('/order/create', authorize([3]), OrderController.create)

module.exports = router