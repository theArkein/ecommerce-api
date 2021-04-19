const ProductController = require('../../controllers/Public/product')

const routes = (router)=>{
     router.get('/product/list', ProductController.list)
     router.get('/product/:id/list', ProductController.listById)
     router.get('/product/vendor/:id/list', ProductController.listByVendor)
     router.get('/product/category/main/:id/list', ProductController.listByMainCategory)
     router.get('/product/category/sub/:id/list', ProductController.listBySubCategory)
     router.get('/product/category/child/:id/list', ProductController.listByChildCategory)
}
                         
module.exports = routes