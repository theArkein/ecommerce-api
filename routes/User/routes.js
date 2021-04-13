var express = require('express')
var router = express.Router()

var UserAuthController = require('../../controllers/User/UserAuth')

router.post('/auth/signin', UserAuthController.signin)
router.post('/auth/signup', UserAuthController.signup)

module.exports = router