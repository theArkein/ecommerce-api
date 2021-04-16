const express = require('express')
const router = express.Router()

const ProductController = require('../../controllers/Product/product')
const authorize = require('../../middlewares/authorize')
const productAuth = require('../../middlewares/Product/authorize')


router.get('/list', ProductController.list)
router.get('/:id/list', ProductController.listById)
router.get('/vendor/:id/list', ProductController.listByVendor)
router.get('/category/main/:id/list', ProductController.listByMainCategory)
router.get('/category/sub/:id/list', ProductController.listBySubCategory)
router.get('/category/child/:id/list', ProductController.listByChildCategory)

router.post('/create', authorize([2]), ProductController.create)
router.put('/edit/:id', authorize([1,2]), productAuth, ProductController.edit)
router.delete('/remove/:id', authorize([1,2]), productAuth, ProductController.removeOne)
router.delete('/removeAll', ProductController.removeAll)


module.exports = router