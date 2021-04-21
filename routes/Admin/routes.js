const express = require('express')
const multer  = require('multer')
const fs  = require('fs')

const router = express.Router()

const AdminAuthController = require('@controllers/Admin/AdminAuth')
const OrderController = require('@controllers/Order/order')

const MainCategoryController = require('@controllers/Admin/Category/mainCategory')
const SubCategoryController = require('@controllers/Admin/Category/subCategory')
const ChildCategoryController = require('@controllers/Admin/Category/childCategory')


const authorize = require('@middlewares/authorize')

var storage = (folder)=>{
     let destination = 'images/' + folder
     return multer.diskStorage({
          destination: function (req, file, cb) {
          //   fs.mkdirSync(destination, { recursive: true })
            cb(null, destination)
          },
          filename: function (req, file, cb) {
               console.log(file.originalname)
               let name = file.originalname.split('.')
               cb(null, Date.now() + '.' + name[name.length-1] )
          }
      })
}
const customMulter = (folder)=>{
     return multer({storage: storage(folder)}).any()
}

router.post('/auth/signin', AdminAuthController.signin)
router.post('/auth/signup', AdminAuthController.signup)

// Only admin is authorized to access following routes
router.use(authorize([1]))

// Main Category
router.get('/category/main/list', MainCategoryController.list)
router.post('/category/main/create', customMulter('category'), MainCategoryController.create)
router.put('/category/main/:id/edit', customMulter('category'), MainCategoryController.edit)
router.delete('/category/main/remove/:id', MainCategoryController.removeOne)
router.delete('/category/main/removeAll', MainCategoryController.removeAll)

// Sub Category
router.get('/category/sub/list', SubCategoryController.list)
router.post('/category/sub/create', SubCategoryController.create)
router.put('/category/sub/edit/:id', SubCategoryController.edit)
router.delete('/category/sub/remove/:id', SubCategoryController.removeOne)
router.delete('/category/sub/removeAll', SubCategoryController.removeAll)

// Child Category
router.get('/category/child/list', ChildCategoryController.list)
router.post('/category/child/create', ChildCategoryController.create)
router.put('/category/child/edit/:id', ChildCategoryController.edit)
router.delete('/category/child/remove/:id', ChildCategoryController.removeOne)
router.delete('/category/child/removeAll', ChildCategoryController.removeAll)


// orders
router.get('/order/list', OrderController.list)

module.exports = router