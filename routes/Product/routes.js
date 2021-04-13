const express = require('express')
const router = express.Router()

const ProductController = require('../../controllers/Product/product')
const authorize = require('../../middlewares/authorize')
const productAuth = require('../../middlewares/Product/authorize')


router.get('/list', ProductController.list)
router.get('/list/:id', ProductController.listById)
router.post('/create', authorize([2]), ProductController.create)
router.put('/edit/:id', authorize([1,2]), productAuth, ProductController.edit)
router.delete('/remove/:id', authorize([1,2]), productAuth, ProductController.removeOne)
router.delete('/removeAll', authorize([1,2]), productAuth, ProductController.removeAll)


module.exports = router