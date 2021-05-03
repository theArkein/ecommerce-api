const express = require('express')
const router = express.Router()
const passport = require('passport')


const UserAuthController = require('@controllers/User/UserAuth')
const OrderController = require('@controllers/User/order')

const authorize = require('@middlewares/authorize')

const UserAccount = require('@controllers/User/account')

// authentication
router.post('/auth/signin', UserAuthController.signin)
router.post('/auth/signup', UserAuthController.signup)

// Google auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/auth/google/return', passport.authenticate('google', {session : false}), UserAuthController.google);

// Facebook auth
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_birthday']} ));
router.get('/auth/facebook/return', passport.authenticate('facebook', {session : false}), UserAuthController.facebook);



// Account Verification
router.get('/account/verify', UserAccount.verify )


// reset password
router.post('/account/forgot-password', UserAccount.forgotPassword)
router.post('/account/reset-password', UserAccount.resetPassword)


// account details & update
router.get('/account/profile/details', authorize([3]), UserAccount.profileDetails )
router.put('/account/profile/update', authorize([3]), UserAccount.profileUpdate )

// orders
router.get('/order/list', authorize([3]), OrderController.list)
router.get('/order/:orderId/detail', authorize([3]), OrderController.detail)
router.post('/order/create', authorize([3]), OrderController.create)

module.exports = router

