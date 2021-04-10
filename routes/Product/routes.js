const express = require('express')
const router = express.Router()

const ProductController = require('../../controllers/Product/product')

router.get('/list', ProductController.list)
router.get('/list/:id', ProductController.listById)
router.post('/create', ProductController.create)
router.put('/edit/:id', ProductController.edit)
router.delete('/remove/:id', ProductController.removeOne)
router.delete('/removeAll', ProductController.removeAll)


module.exports = router