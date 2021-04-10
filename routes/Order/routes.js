const express = require('express')
const router = express.Router()

const OrderController = require('../../controllers/Order/order')

router.get('/list', OrderController.list)
router.get('/list/:id', OrderController.listById)
router.post('/create', OrderController.create)
router.put('/edit/:id', OrderController.edit)
router.delete('/remove/:id', OrderController.removeOne)
router.delete('/removeAll', OrderController.removeAll)


module.exports = router