var express = require('express')
var router = express.Router()

var VendorAuthController = require('../../controllers/Vendor/VendorAuth')
const ProductController = require('../../controllers/Product/product')

// authorization
router.post('/auth/signin', VendorAuthController.signin)
router.post('/auth/signup', VendorAuthController.signup)

// products
router.get('/:id/product/list', ProductController.listByVendor)

module.exports = router