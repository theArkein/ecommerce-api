const express = require('express')
const router = express.Router()

const AdminAuthController = require('../../controllers/Admin/AdminAuth')

router.post('/auth/signin', AdminAuthController.signin)
router.post('/auth/signup', AdminAuthController.signup)

module.exports = router