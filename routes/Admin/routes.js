const express = require('express')
const router = express.Router()

const AdminAuthController = require('@controllers/Admin/auth')

const MainCategoryController = require('@controllers/Admin/Category/mainCategory')
const SubCategoryController = require('@controllers/Admin/Category/subCategory')
const ChildCategoryController = require('@controllers/Admin/Category/childCategory')

const VendorController = require('@controllers/Admin/vendor')
const UserController = require('@controllers/Admin/user')
const ProductController = require('@controllers/Admin/product')
const OrderController = require('@controllers/Admin/order')
const ProductEnquiryController = require('@controllers/Admin/productEnquiry.js')


const SliderController = require('@controllers/Admin/Site/slider')
const AdController = require('@controllers/Admin/Site/ad')
const BannerController = require('@controllers/Admin/Site/banner')
const RecommendedCategoryController = require('@controllers/Admin/Site/recommendedCategory')
const StatisticsController = require("@controllers/Admin/statistics")

const authorize = require('@middlewares/authorize')
const adminAuthorize = require('@middlewares/Admin/authorize')


// auth routes
router.post('/auth/signin', AdminAuthController.signin)
router.post('/auth/signup', authorize([1]), adminAuthorize("SUPERADMIN"), AdminAuthController.signup)
router.get('/list', authorize([1]), adminAuthorize("SUPERADMIN"), AdminAuthController.list)


// Only admin is authorized to access following routes
router.use(authorize([1]))

// Main Category
router.get('/category/main/list', adminAuthorize(null, "READ", "CATEGORIES"), MainCategoryController.list)
router.post('/category/main/create', adminAuthorize(null, "CREATE", "CATEGORIES"), MainCategoryController.create)
router.put('/category/main/:id/edit', adminAuthorize(null, "UPDATE", "CATEGORIES"), MainCategoryController.edit)
router.delete('/category/main/:id/remove', adminAuthorize(null, "DELETE", "CATEGORIES"), MainCategoryController.removeOne)
router.delete('/category/main/removeAll', adminAuthorize(null, "DELETE", "CATEGORIES"), MainCategoryController.removeAll)

// Sub Category
router.get('/category/sub/list', adminAuthorize(null, "READ", "CATEGORIES"), SubCategoryController.list)
router.post('/category/sub/create', adminAuthorize(null, "CREATE", "CATEGORIES"), SubCategoryController.create)
router.put('/category/sub/:id/edit', adminAuthorize(null, "UPDATE", "CATEGORIES"), SubCategoryController.edit)
router.delete('/category/sub/:id/remove', adminAuthorize(null, "DELETE", "CATEGORIES"), SubCategoryController.removeOne)
router.delete('/category/sub/removeAll', adminAuthorize(null, "DELETE", "CATEGORIES"), SubCategoryController.removeAll)

// Child Category
router.get('/category/child/list', adminAuthorize(null, "READ", "CATEGORIES"), ChildCategoryController.list)
router.post('/category/child/create', adminAuthorize(null, "CREATE", "CATEGORIES"), ChildCategoryController.create)
router.put('/category/child/:id/edit', adminAuthorize(null, "UPDATE", "CATEGORIES"), ChildCategoryController.edit)
router.delete('/category/child/:id/remove', adminAuthorize(null, "DELETE", "CATEGORIES"), ChildCategoryController.removeOne)
router.delete('/category/child/removeAll', adminAuthorize(null, "DELETE", "CATEGORIES"), ChildCategoryController.removeAll)

// product
router.get('/product/:id/approve', adminAuthorize(null, "UPDATE", "PRODUCTS"), ProductController.approve )
router.get('/product/:id/suspend', adminAuthorize(null, "UPDATE", "PRODUCTS"), ProductController.suspend )
router.get('/product/list', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.list)
router.get('/product/:id/detail', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.detail)
router.get('/product/vendor/:id/list', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.listByVendor)
router.get('/product/category/main/:id/list', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.listByMainCategory)
router.get('/product/category/sub/:id/list', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.listBySubCategory)
router.get('/product/category/child/:id/list', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.listByChildCategory)
router.get('/product/search', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.search)
router.get('/product/latest/list', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.listLatest)
router.get('/product/most-viewed/list', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.listMostViewed)
router.get('/product/flash-deal/list', adminAuthorize(null, "READ", "PRODUCTS"), ProductController.listFlashDeal)

// vendor
router.get('/vendor/list', adminAuthorize(null, "READ", "VENDORS"), VendorController.list)
router.get('/vendor/:id/detail', adminAuthorize(null, "READ", "VENDORS"), VendorController.detail)
router.get('/vendor/:id/account/approve', adminAuthorize(null, "UPDATE", "VENDORS"), VendorController.approve)
router.get('/vendor/:id/account/suspend', adminAuthorize(null, "UPDATE", "VENDORS"), VendorController.suspend)

// user
router.get('/user/list', adminAuthorize(null, "READ", "USERS"), UserController.list)
router.get('/user/:id/detail', adminAuthorize(null, "READ", "USERS"), UserController.detail)

// order
router.get('/order/list', adminAuthorize(null, "READ", "ORDERS"), OrderController.list)
router.get('/order/:orderId/detail', adminAuthorize(null, "READ", "ORDERS"), OrderController.detail)
router.put('/order/:orderId/cancel', adminAuthorize(null, "UPDATE", "ORDERS"), OrderController.cancel)
router.put('/order/:orderId/decline', adminAuthorize(null, "UPDATE", "ORDERS"), OrderController.decline)
router.put('/order/:orderId/ship', adminAuthorize(null, "UPDATE", "ORDERS"), OrderController.ship)
router.put('/order/:orderId/complete', adminAuthorize(null, "UPDATE", "ORDERS"), OrderController.complete)
router.put('/order/:orderId/refund', adminAuthorize(null, "UPDATE", "ORDERS"), OrderController.refund)

// product enquiry
router.get('/product-enquiry/list', adminAuthorize(null, "READ", "PRODUCT_ENQUIRIES"), ProductEnquiryController.list)
router.delete('/product-enquiry/:id/delete', adminAuthorize(null, "DELETE", "PRODUCT_ENQUIRIES"), ProductEnquiryController.remove)

// site

// sliders
router.get('/site/sliders/featured', adminAuthorize(null, "READ", "SETTINGS"), SliderController.featuredSlidersInfo)
router.put('/site/sliders/featured', adminAuthorize(null, "UPDATE", "SETTINGS"), SliderController.featuredSlidersUpdate)
router.get('/site/sliders/category', adminAuthorize(null, "READ", "SETTINGS"), SliderController.categorySlidersInfo)
router.post('/site/sliders/category', adminAuthorize(null, "CREATE", "SETTINGS"), SliderController.categorySlidersAdd)
router.put('/site/sliders/category/:id', adminAuthorize(null, "UPDATE", "SETTINGS"), SliderController.categorySlidersUpdate)
router.delete('/site/sliders/category/:id', adminAuthorize(null, "DELETE", "SETTINGS"), SliderController.categorySlidersDelete)

// ads
router.get('/site/ad', adminAuthorize(null, "READ", "SETTINGS"), AdController.adInfo)
router.post('/site/ad', adminAuthorize(null, "CREATE", "SETTINGS"), AdController.adAdd)
router.put('/site/ad/:id', adminAuthorize(null, "UPDATE", "SETTINGS"), AdController.adUpdate)
router.delete('/site/ad/:id', adminAuthorize(null, "DELETE", "SETTINGS"), AdController.adDelete)

// banner
router.get('/site/banner', adminAuthorize(null, "READ", "SETTINGS"), BannerController.info)
router.get('/site/banner/large', adminAuthorize(null, "READ", "SETTINGS"), BannerController.largeInfo)
router.put('/site/banner/large', adminAuthorize(null, "UPDATE", "SETTINGS"), BannerController.largeUpdate)
router.get('/site/banner/small', adminAuthorize(null, "UPDATE", "SETTINGS"), BannerController.smallInfo)
router.put('/site/banner/small/:id', adminAuthorize(null, "UPDATE", "SETTINGS"), BannerController.smallUpdate)

// recommended category
router.get('/site/recommended-category', adminAuthorize(null, "READ", "SETTINGS"), RecommendedCategoryController.info)
router.post('/site/recommended-category', adminAuthorize(null, "UPDATE", "SETTINGS"), RecommendedCategoryController.add)
router.put('/site/recommended-category/:id', adminAuthorize(null, "READ", "SETTINGS"), RecommendedCategoryController.updateOne)
router.delete('/site/recommended-category/:id', adminAuthorize(null, "UPDATE", "SETTINGS"), RecommendedCategoryController.deleteOne)


// site setting - footer Links
// router.get('/site/setting/footer/info', SiteSetting.footer.info)

// Statistics
router.get('/statistics', StatisticsController.info)

module.exports = router