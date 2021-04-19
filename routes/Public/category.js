const CategoryController = require('../../controllers/Public/category')

const routes = (router)=>{
     router.get('/category/main/list', CategoryController.listMain)
     router.get('/category/sub/list', CategoryController.listSub)
     router.get('/category/child/list', CategoryController.listChild)
}

module.exports = routes