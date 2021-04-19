const VendorController = require('../../controllers/public/vendor')

const routes = (router)=>{
     router.get('/vendor/list', VendorController.list)
}

module.exports = routes