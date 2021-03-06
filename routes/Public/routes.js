const express = require('express')
const router = express.Router()

const CategoryController = require('@controllers/Public/category')
const ProductController = require('@controllers/Public/product')
const VendorController = require('@controllers/Public/vendor')
const SiteController = require('@controllers/Public/site')
const AccountController = require('@controllers/Public/account')
const ProductEnquiryController = require('@controllers/Public/productEnquiry')


// reset password
router.post('/account/forgot-password', AccountController.forgotPassword)
router.post('/account/reset-password', AccountController.resetPassword)

// Category
router.get('/category/main/list', CategoryController.listMain)
router.get('/category/:main/sub/list', CategoryController.listSub)
router.get('/category/:sub/child/list', CategoryController.listChild)

// Product
router.get('/product/list', ProductController.list)
router.get('/product/:id/detail', ProductController.detail)
router.get('/product/:id/related', ProductController.related)
router.get('/product/vendor/:id/list', ProductController.listByVendor)
router.get('/product/category/main/:id/list', ProductController.listByMainCategory)
router.get('/product/category/sub/:id/list', ProductController.listBySubCategory)
router.get('/product/category/child/:id/list', ProductController.listByChildCategory)

// Product search
router.get('/product/search', ProductController.search)

// Featured products
router.get('/product/latest/list', ProductController.listLatest)
router.get('/product/most-viewed/list', ProductController.listMostViewed)
router.get('/product/flash-deal/list', ProductController.listFlashDeal)

// Vendor
router.get('/vendor/list', VendorController.list)
router.get('/vendor/:id/detail', VendorController.detail)


// Site
router.get('/site/sliders', SiteController.sliders)
router.get('/site/banner', SiteController.banner)
router.get('/site/ads', SiteController.ads)
router.get('/site/recommended', SiteController.recommended)

// product enquiry
router.post('/product-enquiry/add', ProductEnquiryController.add)

module.exports = router