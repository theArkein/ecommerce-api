const express = require('express')
const router = express.Router()

const authorize = require('../../middlewares/authorize')
const orderAuth = require('../../middlewares/Order/authorize')

const VendorAuthController = require('../../controllers/Vendor/auth')
const VendorController = require('../../controllers/Vendor/vendor')
const OrderController = require('../../controllers/Order/order')
const ProductController = require('../../controllers/Product/product')

// authorization
router.post('/auth/signin', VendorAuthController.signin)
router.post('/auth/signup', VendorAuthController.signup)

// vendor
router.get('/list', VendorController.list)

// product
router.get('/product/list', ProductController.listByVendor)

// order
router.get('/order/list', authorize([2]), OrderController.listByVendor)

module.exports = router