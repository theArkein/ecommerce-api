const express = require('express')
const router = express.Router()

const authorize = require('@middlewares/authorize')
const multer = require('@middlewares/multer')

const VendorAuthController = require('@controllers/Vendor/auth')
const VendorAccountController = require('@controllers/Vendor/account')
const ProductController = require('@controllers/Vendor/product')
const OrderController = require('@controllers/Vendor/order')
const StatisticsController = require('@controllers/Vendor/statistics')


// authorization
router.post('/auth/signin', VendorAuthController.signin)
router.post('/auth/signup', VendorAuthController.signup)

// statistics
router.get('/statistics', authorize([2]), StatisticsController.statistics)

// Account 
router.get('/profile-details/info', authorize([2]), VendorAccountController.profile)
router.put('/profile-details/update', authorize([2]), VendorAccountController.profileUpdate)
router.get('/account/verify', VendorAccountController.verify )
router.post('/account/forgot-password', VendorAccountController.forgotPassword)
router.post('/account/reset-password', VendorAccountController.resetPassword)
router.post('/account/change-password', authorize([2]), VendorAccountController.changePassword)


// products
router.get('/product/list', authorize([2]), ProductController.list)
router.get('/product/:id/detail', authorize([2]), ProductController.detail)
router.post('/product/create', authorize([2]), ProductController.create)
router.put('/product/:id/edit', authorize([2]), ProductController.edit)
router.delete('/product/:id/delete', authorize([2]), ProductController.remove)

// orders
router.get('/order/list', authorize([2]), OrderController.list)
router.get('/order/:orderId/detail', authorize([2]), OrderController.detail)
router.put('/order/:orderId/cancel', authorize([2]), OrderController.cancel)
router.put('/order/:orderId/decline', authorize([2]), OrderController.decline)
router.put('/order/:orderId/ship', authorize([2]), OrderController.ship)
router.put('/order/:orderId/complete', authorize([2]), OrderController.complete)
router.put('/order/:orderId/refund', authorize([2]), OrderController.refund)

module.exports = router