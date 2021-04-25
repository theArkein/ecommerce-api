const express = require('express')
const router = express.Router()

const CategoryController = require('@controllers/Public/category')
const ProductController = require('@controllers/Public/product')
const VendorController = require('@controllers/Public/vendor')

// Category
router.get('/category/main/list', CategoryController.listMain)
router.get('/category/:main/sub/list', CategoryController.listSub)
router.get('/category/:sub/child/list', CategoryController.listChild)

// Product
router.get('/product/list', ProductController.list)
router.get('/product/:slug/detail', ProductController.detail)
router.get('/product/vendor/:slug/list', ProductController.listByVendor)
router.get('/product/category/main/:slug/list', ProductController.listByMainCategory)
router.get('/product/category/sub/:slug/list', ProductController.listBySubCategory)
router.get('/product/category/child/:slug/list', ProductController.listByChildCategory)

// Vendor
router.get('/vendor/list', VendorController.list)

module.exports = router