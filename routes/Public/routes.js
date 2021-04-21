const express = require('express')
const router = express.Router()

const CategoryController = require('@controllers/Public/category')
const ProductController = require('@controllers/Public/product')
const VendorController = require('@controllers/public/vendor')

// Category
router.get('/category/main/list', CategoryController.listMain)
router.get('/category/sub/list', CategoryController.listSub)
router.get('/category/child/list', CategoryController.listChild)

// Product

router.get('/product/list', ProductController.list)
router.get('/product/:id/list', ProductController.listById)
router.get('/product/vendor/:id/list', ProductController.listByVendor)
router.get('/product/category/main/:id/list', ProductController.listByMainCategory)
router.get('/product/category/sub/:id/list', ProductController.listBySubCategory)
router.get('/product/category/child/:id/list', ProductController.listByChildCategory)

// Vendor
router.get('/vendor/list', VendorController.list)

module.exports = router