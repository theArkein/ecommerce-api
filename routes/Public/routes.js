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

// Feature products
router.get('/product/latest/list', ProductController.listLatest)
router.get('/product/most-viewed/list', ProductController.listMostViewed)
router.get('/product/flash-deal/list', ProductController.listFlashDeal)
router.get('/product/featured-category/list', ProductController.listFeaturedCategory)
router.get('/product/recommended-category/list', ProductController.listRecommendedCategory)

// Vendor
router.get('/vendor/list', VendorController.list)

module.exports = router