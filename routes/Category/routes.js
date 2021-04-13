const express = require('express')
const router = express.Router()

const authorize = require('../../middlewares/authorize')

const MainCategoryController = require('../../controllers/Category/mainCategory')
const SubCategoryController = require('../../controllers/Category/subCategory')
const ChildCategoryController = require('../../controllers/Category/childCategory')


router.get('/main/list', MainCategoryController.list)
router.get('/sub/list', SubCategoryController.list)
router.get('/child/list', ChildCategoryController.list)

// Only Admin is authorized to create, edit and delete
router.use(authorize([1]))

// Main Category
router.post('/main/create', MainCategoryController.create)
router.put('/main/edit/:id', MainCategoryController.edit)
router.delete('/main/remove/:id', MainCategoryController.removeOne)
router.delete('/main/removeAll', MainCategoryController.removeAll)

// Sub Category
router.post('/sub/create', SubCategoryController.create)
router.put('/sub/edit/:id', SubCategoryController.edit)
router.delete('/sub/remove/:id', SubCategoryController.removeOne)
router.delete('/sub/removeAll', SubCategoryController.removeAll)

// Child Category
router.post('/child/create', ChildCategoryController.create)
router.put('/child/edit/:id', ChildCategoryController.edit)
router.delete('/child/remove/:id', ChildCategoryController.removeOne)
router.delete('/child/removeAll', ChildCategoryController.removeAll)


module.exports = router