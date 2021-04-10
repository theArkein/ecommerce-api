var express = require('express')
var router = express.Router()

var MainCategoryController = require('../../controllers/Category/main-category')
var SubCategoryController = require('../../controllers/Category/sub-category')
var ChildCategoryController = require('../../controllers/Category/child-category')

// Main Category
router.get('/main/list', MainCategoryController.list)
router.post('/main/create', MainCategoryController.create)
router.put('/main/edit/:id', MainCategoryController.edit)
router.delete('/main/remove/:id', MainCategoryController.removeOne)
router.delete('/main/removeAll', MainCategoryController.removeAll)

// Sub Category
router.get('/sub/list', SubCategoryController.list)
router.post('/sub/create', SubCategoryController.create)
router.delete('/sub/remove/:id', SubCategoryController.removeOne)
router.delete('/sub/removeAll', SubCategoryController.removeAll)

// Child Category
router.get('/child/list', ChildCategoryController.list)
router.post('/child/create', ChildCategoryController.create)
router.delete('/child/remove/:id', ChildCategoryController.removeOne)
router.delete('/child/removeAll', ChildCategoryController.removeAll)


module.exports = router