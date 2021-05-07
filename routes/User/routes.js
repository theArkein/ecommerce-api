const express = require('express')
const router = express.Router()
const passport = require('passport')


const UserAuthController = require('@controllers/User/UserAuth')
const OrderController = require('@controllers/User/order')

const authorize = require('@middlewares/authorize')

const UserAccount = require('@controllers/User/account')
const WishlistController = require('@controllers/User/wishlist')
const CartController = require('@controllers/User/cart')
const ShippingAddressController = require('@controllers/User/shippingAddress')
const ReviewController = require('@controllers/User/review')
const CommentController = require('@controllers/User/comment')

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
router.get('/shipping-address/info', authorize([3]), ShippingAddressController.all )
router.get('/shipping-address/:id/info', authorize([3]), ShippingAddressController.one )
router.post('/shipping-address/add', authorize([3]), ShippingAddressController.add )
router.put('/shipping-address/:id/update', authorize([3]), ShippingAddressController.update )
router.delete('/shipping-address/:id/remove', authorize([3]), ShippingAddressController.remove )

// wishlist
router.get('/wishlist', authorize([3]), WishlistController.info)
router.post('/wishlist/add/:id', authorize([3]), WishlistController.addItem)
router.put('/wishlist/update', authorize([3]), WishlistController.update)
router.delete('/wishlist/delete/:id', authorize([3]), WishlistController.deleteItem)

// cart
router.get('/cart', authorize([3]), CartController.info)
router.post('/cart/add/:id', authorize([3]), CartController.addItem)
router.put('/cart/update', authorize([3]), CartController.update)
router.delete('/cart/delete/:id', authorize([3]), CartController.deleteItem)

// orders
router.get('/order/list', authorize([3]), OrderController.list)
router.get('/order/:orderId/detail', authorize([3]), OrderController.detail)
router.post('/order/create', authorize([3]), OrderController.create)

// reviews
router.get('/review/list', authorize([3]), ReviewController.list)
router.post('/review/add', authorize([3]), ReviewController.add)
router.delete('/review/delete/:id', authorize([3]), ReviewController.remove)

// comments
router.get('/comment/list', authorize([3]), CommentController.list)
router.post('/comment/add', authorize([3]), CommentController.add)
router.put('/comment/update/:id', authorize([3]), CommentController.update)
router.delete('/comment/delete/:id', authorize([3]), CommentController.remove)


module.exports = router

