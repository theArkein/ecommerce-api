const uniqid = require('uniqid');
const slugify = require('slugify')

const Product = require('@models/product')
const Vendor = require('@models/vendor')

const saveImage = require("@config/saveImage")

const productValidation = require('@middlewares/Vendor/productValidation');

const list = (req, res)=>{
     let filterQuery = {vendor: req.user.id}

     Product.find(filterQuery)
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .then(products=>{
          return res.json({
               success: true,
               results: products.length,
               data: products
          })
     }).catch(err=>{
          return res.json({
               success: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const detail = (req, res)=>{
     let filterQuery = {slug: req.params.slug}
     Product.findOne(filterQuery)
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .then(product=>{
          if(!product)
               return res.json({
                    success: false,
                    results: "No product found"
               })
          if(product.vendor != req.user.id)
               return res.json({
                    success: false,
                    results: "Vendor not authorized for this product"
               })
          return res.json({
               success: true,
               data: product
          })
     }).catch(err=>{
          return res.json({
               success: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const create = (req, res)=>{
     let errors = productValidation.create(req.body)
     if(errors)
          return res.status(400).json({
               success: false,
               message: "Validation failed",
               errors
          })

     let product = req.body
     product.slug = `${slugify(req.body.shortname, {lower: true})}-${uniqid()}`
     product.vendor = req.user.id

     // save image file
     let image = `images/product/${product.slug}/${uniqid()}${uniqid()}.png`
     saveImage(req.body.image, image)
     product.image = image

     // save galley image files
     let gallery = product.gallery.map(item=>{
          let image = `images/product/${product.slug}/${uniqid()}${uniqid()}.png`
          saveImage(item, image)
          return image
     })
     product.gallery = gallery

     product = new Product(product)

     product.save().then(created=>{
          Vendor.findByIdAndUpdate(product.vendor, { $push: { products: created._id } })
          .then(console.log("Product added to vendor"))
          return res.json({
               success: true,
               message: "Successfully created",
               data: created
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const edit = (req, res)=>{

     let errors = productValidation.update(req.body)

     if(errors)
          return res.status(400).json({
               success: false,
               message: "Validation failed",
               errors
          })

     let product = req.body
     let slug = req.params.slug.split('-')
     let slugId = slug[slug.length - 1]
     product.slug = `${slugify(req.body.shortname, {lower: true})}-${slugId}`

     // save image file
     if(product.image){
          let image = `images/product/${product.slug}/${uniqid()}${uniqid()}.png`
          saveImage(req.body.image, image)
          product.image = image
     }

     // save galley image files
     if(product.gallery){
          let gallery = product.gallery.map(item=>{
               let image = `images/product/${product.slug}/${uniqid()}${uniqid()}.png`
               saveImage(item, image)
               return image
          })
          product.gallery = gallery
     }
     let filterQuery = {
          slug: req.params.slug,
          vendor: req.user.id
     }
     Product.findOneAndUpdate(filterQuery, product).then(updated=>{
          if(!updated)
               return res.json({
                    success: false,
                    message: "No such product found"
               })
          return res.json({
               success: true,
               message: "Successfully Updated",
               data: updated
          })
     })

}

const remove = (req,res)=>{
     let filterQuery = {
          slug: req.params.slug,
          vendor: req.user.id
     }
     Product.findOneAndDelete(filterQuery).then(deleted=>{
          if(!deleted)
               return res.json({
                    success: false,
                    message: "No such product found"
               })
          return res.json({
               success: true,
               message: "Successfully deleted"
          })
     })
}

module.exports = {
     list,
     detail,
     create,
     edit,
     remove
}