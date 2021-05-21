const Order = require('@models/order')
const User = require('@models/user')
const Product = require('@models/product')
const Vendor = require('@models/vendor')

const uniqid = require('uniqid');
const sendEmail = require('@config/sendEmail')

const OrderValidation = require('@middlewares/User/order')

const list = (req, res)=>{
     let filterQuery = {user: req.user.id}
     Order.find(filterQuery)
     .populate({
          path: "products.product",
          select: 'name shortname slug sku vendor price discount image'
      })
      .sort({createdAt: -1})
     .then(orders=>{
          return res.json({
               status: true,
               results: orders.length,
               data: orders
          })
     }).catch(err=>{
          return res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const detail = (req, res)=>{
     let filterQuery = {
          orderId : req.params.orderId
     }
     Order.findOne(filterQuery)
     .populate({
          path: "products.product",
          select: 'name shortname slug sku vendor price discount image'
      })
     .then(order=>{
          if(order.user!=req.user.id)
               return res.json({
                    status: false,
                    data: "User not authorized for this order"
               })
          return res.json({
               status: true,
               data: order
          })
     }).catch(err=>{
          return res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const creat = (req, res)=>{

     let errors = OrderValidation.create(req.body)
     if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {shippingAddress} = req.body
     
     User.findById(req.user.id)
     .populate('cart.product')
     .then(user=>{
          let cart = user.cart
          if(!cart.length){
               return res.json({
                    success: false,
                    message: "Cart is empty. Please add products first"
               })
          }
          let totalCost = 0
          let totalProducts = 0
          let totalQuantity = 0
          let products = []
          let vendor = cart[0].product.vendor
          
          cart.forEach(cartItem => {
               let q = cartItem.quantity
               let u = (cartItem.product.discount)? (cartItem.product.price - (cartItem.product.discount * cartItem.product.price)/100) : cartItem.product.price
               let t = q * u
               let p = cartItem.product._id

               products.push({
                    product: p,
                    quantity: q,
                    unitCost: u,
                    totalCost: t
               })
               totalCost += t
               totalQuantity += q
               totalProducts++
          });
          
          let order = {
               orderId: uniqid(),
               totalProducts,
               totalQuantity,
               totalCost,
               user: req.user.id,
               vendor,
               products,
               shippingAddress
          }

          let newOrder = new Order(order)

          newOrder.save().then(created=>{
               
               User.findById(req.user.id).then(user=>{
                    sendEmail("Travel Right", `Your order with id: ${newOrder.orderId} has been placed successfully`, user.email)
               })

               User.findOneAndUpdate(req.user.id, {cart: []}).then(user=>{
                    console.log("Cart empty done")
               })

               return res.json({
                    status: true,
                    message: "Successfully created",
                    data: created
               })
          }).catch(err=>{
               return res.json({
                    status: false,
                    message: err.message,
                    errors: err.errors
               })
          })
     })

     
}

const create = async (req, res)=>{

     let errors = OrderValidation.create(req.body)
     if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {shippingAddress} = req.body

     let user = await User.findById(req.user.id).populate("cart.product", "name shortname stock discount vendor price")

     let cart = user.cart
     if(!cart.length){
          return res.json({
               success: false,
               message: "Cart is empty. Please add products first"
          })
     }
     let vendor = await Vendor.findById(user.cart[0].product.vendor)
     let totalCost = 0
     let totalProducts = 0
     let totalQuantity = 0
     let products = []
     let outOfStock = false
     cart.forEach(async cartItem=>{
          if(cartItem.product.stock!=null && cartItem.product.stock<cartItem.quantity){
               outOfStock = true
          }
          let q = cartItem.quantity
          let u = (cartItem.product.discount)? (cartItem.product.price - (cartItem.product.discount * cartItem.product.price)/100) : cartItem.product.price
          let t = q * u
          let p = cartItem.product._id

          products.push({
               product: p,
               quantity: q,
               unitCost: u,
               totalCost: t
          })
          totalCost += t
          totalQuantity += q
          totalProducts++
     })
     if(outOfStock){
          return res.json({
               success: false,
               message: "Some items in cart are out of stock. Please reconfirm your order"
          })
     }
     let order = {
          orderId: uniqid(),
          totalProducts,
          totalQuantity,
          totalCost,
          user: req.user.id,
          vendor: vendor._id,
          products,
          shippingAddress
     }

     let newOrder = new Order(order)
     res.json(newOrder)
     cart.forEach(cartItem=>{
          let quantity = cartItem.quantity
          Product.findByIdAndUpdate(cartItem.product._id,{$inc: {stock: -quantity}}).then(p=>{
               console.log("product stock updated")
          })
     })
     
     newOrder.save().then(created=>{
               
          User.findById(req.user.id).then(user=>{
               sendEmail("Travel Right", `Your order with id: ${newOrder.orderId} has been placed successfully`, user.email)
          })
          // notify user and vendor
          sendEmail("Travel Right", `Your order with id: ${newOrder.orderId} has been placed successfully`, user.email)
          sendEmail("Travel Right", `A new order with id ${newOrder.orderId} has been placed for your vendor`, vendor.email)

          // Empty cart
          user.cart = []
          user.save()

          return res.json({
               status: true,
               message: "Successfully created",
               data: created
          })
     }).catch(err=>{
          return res.json({
               status: false,
               message: err.message,
               errors: err.errors
          })
     })
     
}

const cancel = (req, res)=>{
     let id = req.params.orderId
     let filterQuery = {user: req.user.id, orderId: id, status: {$nin: [2, 4, 5]} }
     Order.findOneAndUpdate(filterQuery, {status: 1}).then(updated=>{
          if(!updated){
               return res.json({
                    success: false,
                    message: "This order cannot be cancelled"
               })
          }
          User.findById(updated.user).then(user=>{
               sendEmail("Travel Right", `Your order with id: ${id} has been cancelled`, user.email)
          })
          return res.json({
               success: true,
               message: "Order successfully cancelled",
               data: updated
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}


module.exports = {
     list,
     detail,
     create,
     cancel
}