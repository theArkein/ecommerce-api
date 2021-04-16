const express = require('express')
const router = express.Router()

const authorize = require('../../middlewares/authorize')
const orderAuth = require('../../middlewares/Order/authorize')

const VendorAuthController = require('../../controllers/Vendor/auth')
const VendorController = require('../../controllers/Vendor/vendor')

// authorization
router.post('/auth/signin', VendorAuthController.signin)
router.post('/auth/signup', VendorAuthController.signup)

// products
router.get('/product/list', authorize([2]), VendorController.listProducts)

// orders
router.get('/order/list', authorize([2]), VendorController.listOrders)

module.exports = router