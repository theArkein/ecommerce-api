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


// auth routes
router.post('/auth/signin', AdminAuthController.signin)
router.post('/auth/signup', AdminAuthController.signup)

// Only admin is authorized to access following routes
router.use(authorize([1]))

// Main Category
router.get('/category/main/list', MainCategoryController.list)
router.post('/category/main/create', MainCategoryController.create)
router.put('/category/main/:id/edit', MainCategoryController.edit)
router.delete('/category/main/:id/remove', MainCategoryController.removeOne)
router.delete('/category/main/removeAll', MainCategoryController.removeAll)

// Sub Category
router.get('/category/sub/list', SubCategoryController.list)
router.post('/category/sub/create', SubCategoryController.create)
router.put('/category/sub/:id/edit', SubCategoryController.edit)
router.delete('/category/sub/:id/remove', SubCategoryController.removeOne)
router.delete('/category/sub/removeAll', SubCategoryController.removeAll)

// Child Category
router.get('/category/child/list', ChildCategoryController.list)
router.post('/category/child/create', ChildCategoryController.create)
router.put('/category/child/:id/edit', ChildCategoryController.edit)
router.delete('/category/child/:id/remove', ChildCategoryController.removeOne)
router.delete('/category/child/removeAll', ChildCategoryController.removeAll)

// product
router.get('/product/:id/approve', ProductController.approve )
router.get('/product/:id/suspend', ProductController.suspend )
router.get('/product/list', ProductController.list)
router.get('/product/:id/detail', ProductController.detail)
router.get('/product/vendor/:id/list', ProductController.listByVendor)
router.get('/product/category/main/:id/list', ProductController.listByMainCategory)
router.get('/product/category/sub/:id/list', ProductController.listBySubCategory)
router.get('/product/category/child/:id/list', ProductController.listByChildCategory)
router.get('/product/search', ProductController.search)
router.get('/product/latest/list', ProductController.listLatest)
router.get('/product/most-viewed/list', ProductController.listMostViewed)
router.get('/product/flash-deal/list', ProductController.listFlashDeal)

// vendor
router.get('/vendor/list', VendorController.list)
router.get('/vendor/:id/detail', VendorController.detail)
router.get('/vendor/:id/account/approve', VendorController.approve)
router.get('/vendor/:id/account/suspend', VendorController.suspend)

// user
router.get('/user/list', UserController.list)
router.get('/user/:id/detail', UserController.detail)

// order
router.get('/order/list', OrderController.list)
router.get('/order/:orderId/detail', OrderController.detail)
router.put('/order/:orderId/cancel', OrderController.cancel)
router.put('/order/:orderId/decline', OrderController.decline)
router.put('/order/:orderId/ship', OrderController.ship)
router.put('/order/:orderId/complete', OrderController.complete)
router.put('/order/:orderId/refund', OrderController.refund)

// product enquiry
router.get('/product-enquiry/list', ProductEnquiryController.list)
router.delete('/product-enquiry/:id/delete', ProductEnquiryController.remove)

// site

// sliders
router.get('/site/sliders/featured', SliderController.featuredSlidersInfo)
router.put('/site/sliders/featured', SliderController.featuredSlidersUpdate)
router.get('/site/sliders/category', SliderController.categorySlidersInfo)
router.post('/site/sliders/category', SliderController.categorySlidersAdd)
router.put('/site/sliders/category/:id', SliderController.categorySlidersUpdate)
router.delete('/site/sliders/category/:id', SliderController.categorySlidersDelete)

// ads
router.get('/site/ad', AdController.adInfo)
router.post('/site/ad', AdController.adAdd)
router.put('/site/ad/:id', AdController.adUpdate)
router.delete('/site/ad/:id', AdController.adDelete)

// banner
router.get('/site/banner', BannerController.info)
router.get('/site/banner/large', BannerController.largeInfo)
router.put('/site/banner/large', BannerController.largeUpdate)
router.get('/site/banner/small', BannerController.smallInfo)
router.put('/site/banner/small/:id', BannerController.smallUpdate)

// recommended category
router.get('/site/recommended-category', RecommendedCategoryController.info)
router.post('/site/recommended-category', RecommendedCategoryController.add)
router.put('/site/recommended-category/:id', RecommendedCategoryController.updateOne)
router.delete('/site/recommended-category/:id', RecommendedCategoryController.deleteOne)


// site setting - footer Links
// router.get('/site/setting/footer/info', SiteSetting.footer.info)

// Statistics
router.get('/statistics', StatisticsController.info)

module.exports = router