const express = require('express')
const router = express.Router()

const AdminAuthController = require('@controllers/Admin/AdminAuth')

const MainCategoryController = require('@controllers/Admin/Category/mainCategory')
const SubCategoryController = require('@controllers/Admin/Category/subCategory')
const ChildCategoryController = require('@controllers/Admin/Category/childCategory')

const VendorController = require('@controllers/Admin/vendor')
const UserController = require('@controllers/Admin/user')
const ProductController = require('@controllers/Admin/product')
const OrderController = require('@controllers/Admin/order')


const authorize = require('@middlewares/authorize')
const multer  = require('@middlewares/multer')


// auth routes
router.post('/auth/signin', AdminAuthController.signin)
router.post('/auth/signup', AdminAuthController.signup)

// Only admin is authorized to access following routes
router.use(authorize([1]))

// Main Category
router.get('/category/main/list', MainCategoryController.list)
router.post('/category/main/create',  multer('category'), MainCategoryController.create)
router.put('/category/main/:slug/edit', multer('category'), MainCategoryController.edit)
router.delete('/category/main/:slug/remove', MainCategoryController.removeOne)
router.delete('/category/main/removeAll', MainCategoryController.removeAll)

// Sub Category
router.get('/category/sub/list', SubCategoryController.list)
router.post('/category/sub/create', SubCategoryController.create)
router.put('/category/sub/:slug/edit', SubCategoryController.edit)
router.delete('/category/sub/:slug/remove', SubCategoryController.removeOne)
router.delete('/category/sub/removeAll', SubCategoryController.removeAll)

// Child Category
router.get('/category/child/list', ChildCategoryController.list)
router.post('/category/child/create', ChildCategoryController.create)
router.put('/category/child/:slug/edit', ChildCategoryController.edit)
router.delete('/category/child/:slug/remove', ChildCategoryController.removeOne)
router.delete('/category/child/removeAll', ChildCategoryController.removeAll)

// product
router.get('/product/list', ProductController.list)
router.get('/product/:slug/detail', ProductController.detail)

// vendor
router.get('/vendor/list', VendorController.list)
router.get('/vendor/:slug/detail', VendorController.detail)

// user
router.get('/user/list', UserController.list)
router.get('/user/:slug/detail', UserController.detail)

// order
router.get('/order/list', OrderController.list)
router.get('/order/:orderId/detail', OrderController.detail)


module.exports = router