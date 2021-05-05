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
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}))
router.get('/auth/google/return', passport.authenticate('google', {session : false}), UserAuthController.google)
router.post('/auth/google/token', passport.authenticate('google-oauth-token'), UserAuthController.googleToken)

// Facebook auth
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_birthday']} ))
router.get('/auth/facebook/return', passport.authenticate('facebook', {session : false}), UserAuthController.facebook)
router.post('/auth/facebook/token', passport.authenticate('facebook-token'), UserAuthController.facebookToken)




// Account Verification
router.get('/account/verify', UserAccount.verify )


// reset password
router.post('/account/forgot-password', UserAccount.forgotPassword)
router.post('/account/reset-password', UserAccount.resetPassword)


// account details & update
router.get('/profile-details/info', authorize([3]), UserAccount.profileDetails.info )
router.put('/profile-details/update', authorize([3]), UserAccount.profileDetails.update )

// shipping details
router.get('/shipping-address/info', authorize([3]), UserAccount.shippingAddress.all )
router.get('/shipping-address/:id/info', authorize([3]), UserAccount.shippingAddress.one )
router.post('/shipping-address/add', authorize([3]), UserAccount.shippingAddress.add )
router.put('/shipping-address/:id/update', authorize([3]), UserAccount.shippingAddress.update )
router.delete('/shipping-address/:id/remove', authorize([3]), UserAccount.shippingAddress.delete )


// orders
router.get('/order/list', authorize([3]), OrderController.list)
router.get('/order/:orderId/detail', authorize([3]), OrderController.detail)
router.post('/order/create', authorize([3]), OrderController.create)

module.exports = router

