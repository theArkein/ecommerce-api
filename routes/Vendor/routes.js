const express = require('express')
const router = express.Router()

const authorize = require('@middlewares/authorize')
const multer = require('@middlewares/multer')

const VendorAuthController = require('@controllers/Vendor/auth')
const VendorAccountController = require('@controllers/Vendor/account')
const ProductController = require('@controllers/Vendor/product')
const OrderController = require('@controllers/Vendor/order')

// authorization
router.post('/auth/signin', VendorAuthController.signin)
router.post('/auth/signup', VendorAuthController.signup)

// Account 
router.get('/account/verify', VendorAccountController.verify )
router.post('/account/forgot-password', VendorAccountController.forgotPassword)
router.post('/account/reset-password', VendorAccountController.resetPassword)


// products
router.get('/product/list', authorize([2]), ProductController.list)
router.get('/product/:slug/detail', authorize([2]), ProductController.detail)
router.post('/product/create', authorize([2]), ProductController.create)
router.put('/product/:slug/edit', authorize([2]), ProductController.edit)
router.delete('/product/:slug/delete', authorize([2]), ProductController.remove)

// orders
router.get('/order/list', authorize([2]), OrderController.list)
router.get('/order/:orderId/detail', authorize([2]), OrderController.detail)

module.exports = router