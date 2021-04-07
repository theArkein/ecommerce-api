var express = require('express')
var router = express.Router()

var AdminAuthController = require('../../controllers/Admin/AdminAuth')

router.post('/auth/signin', AdminAuthController.signin)
router.post('/auth/signup', AdminAuthController.signup)

module.exports = router