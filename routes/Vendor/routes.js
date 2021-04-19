const express = require('express')
const router = express.Router()

const authorize = require('../../middlewares/authorize')

const VendorAuthController = require('../../controllers/Vendor/auth')
const VendorController = require('../../controllers/Vendor/vendor')
const ProductController = require('../../controllers/Vendor/product')


// authorization
router.post('/auth/signin', VendorAuthController.signin)
router.post('/auth/signup', VendorAuthController.signup)

// products
router.get('/product/list', authorize([2]), ProductController.list)
router.post('/product/create', authorize([2]), ProductController.create)
router.put('/product/:id/edit', authorize([2]), ProductController.edit)
router.delete('/product/:id/delete', authorize([2]), ProductController.remove)

// orders
router.get('/order/list', authorize([2]), VendorController.listOrders)


module.exports = router