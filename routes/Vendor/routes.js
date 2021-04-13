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

// Vendor
router.get('/list', VendorController.list)

// products
router.get('/:id/product/list', ProductController.listByVendor)

// orders
router.get('/order/list', authorize([1,2,3]), OrderController.list)

module.exports = router