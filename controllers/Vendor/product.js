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
     // let errors = productValidation.create(req.body)
     // if(errors)
     //      return res.status(400).json({
     //           success: false,
     //           message: "Validation failed",
     //           errors
     //      })
     res.json(req.body)

     saveImage(req.body.image, `images/product/122/${uniqid()}${uniqid()}.png`)

     // let product = {
     //      name: req.body.name,
     //      shortname: req.body.shortname,
     //      slug: slugify(`${req.body.shortname}-${uniqid()}`, {lower: true}),
     //      sku: req.body.sku,
     //      vendor: req.user.id,
     //      price: req.body.price,
     //      discount: req.body.discount || 0,
     //      discountedPrice: req.body.discount? req.body.price - req.body.discount/100 * req.body.price : req.body.price,
     //      stock: req.body.stock,
     //      publish: req.body.publish || true,
     //      success: req.body.status || 1,
     //      mainCategory: req.body.mainCategory,
     //      subCategory: req.body.subCategory,
     //      childCategory: req.body.childCategory,
     //      // images: {
     //      //      featured: {
     //      //           path: null,
     //      //           link: null
     //      //      },
     //      //      gallery: {
     //      //           paths: [],
     //      //           links: []
     //      //      }
     //      // },
     //      // variantTypes: {
     //      //      types: (Array.isArray(req.body.variants))?req.body.variants : [ req.body.variants ]
     //      // },
     // }


     // Format variants in one object form
     // product.variantsTypes.forEach(variant => {
     //      product.variants[`${variant}`] = {
     //           types: req.body[`${variant}Type`],
     //           price: req.body[`${variant}Price`]
     //      }
     // });
     
     // Save images paths
     // if(images.length){
     //      // save featuredImage path if provided
     //      if(images[0].fieldname == "featuredImage"){
     //           product.images.featured.path = images[0].filename
     //           // save galleryImage paths if provided and featured image Exits
     //           if(images.length>=2){
     //                for(let i=1; i<images.length; i++){
     //                     product.images.gallery.paths.push(images[i].filename)
     //                }
     //           } else {
     //                product.images.gallery.paths = undefined
     //           }
     //      }else {
     //           // save galleryImage paths if provided and featured image doesnot Exits
     //           if(images.length>=2){
     //                for(let i=0; i<images.length; i++){
     //                     product.images.gallery.paths.push(images[i].filename)
     //                }
     //           } else {
     //                product.images.gallery.paths = undefined
     //           }
     //      }
     // }

     // if(req.body.featuredImageLink)
     //      product.images.featured.link = req.body.featuredImageLink

     // if(req.body.galleryImageLink)
     //      product.images.gallery.links = req.body.galleryImageLink || undefined

     // let newProduct = new Product(product)
     // console.log(newProduct)

     // newProduct.save().then(created=>{
     //      Vendor.findByIdAndUpdate(newProduct.vendor, { $push: { products: created._id } })
     //      .then(console.log("Product added to vendor"))
     //      return res.json({
     //           success: true,
     //           message: "Successfully created",
     //           data: created
     //      })
     // }).catch(err=>{
     //      return res.json({
     //           success: false,
     //           message: err.message,
     //           errors: err.errors
     //      })
     // })
}

const edit = (req, res)=>{
     let errors = productValidation.create(req.body)
     if(errors)
          return res.status(400).json({
               success: false,
               message: "Validation failed",
               errors
          })

     let update = {
          name: req.body.name,
          shortName: req.body.shortName,
          sku: req.body.sku,
          price: req.body.price,
          stock: req.body.stock,
          publish: req.body.publish || true,
          success: req.body.status || 1,
          mainCategory: req.body.mainCategory,
          subCategory: req.body.subCategory,
          childCategory: req.body.childCategory,
          // images: {
          //      featured: {
          //           path: undefined,
          //           link: undefined
          //      },
          //      gallery: {
          //           paths: [],
          //           links: []
          //      }
          // },
          // variants: {
          //      types: req.body.variants
          // }
     }
     // Format variants in one object form
     // product.variants.types.forEach(variant => {
     //      console.log(variant)
     //      product.variants[`${variant}`] = {
     //           types: req.body[`${variant}Type`],
     //           price: req.body[`${variant}Price`]
     //      }
     // });
     // let images = req.files
     
     // Save images paths if images provided
     // if(images.length){
     //      // save featuredImage path if provided
     //      if(images[0].fieldname == "featuredImage"){
     //           product.images.featured.path = images[0].filename
     //           // save galleryImage paths if provided and featured image Exits
     //           if(images.length>=2){
     //                for(let i=1; i<images.length; i++){
     //                     product.images.gallery.paths.push(images[i].filename)
     //                }
     //           } else {
     //                product.images.gallery.paths = undefined
     //           }
     //      }else {
     //           // save galleryImage paths if provided and featured image doesnot Exits
     //           if(images.length>=2){
     //                for(let i=0; i<images.length; i++){
     //                     product.images.gallery.paths.push(images[i].filename)
     //                }
     //           } else {
     //                product.images.gallery.paths = undefined
     //           }
     //      }
     // }

     // if(req.body.featuredImageLink)
     //      product.images.featured.link = req.body.featuredImageLink

     // if(req.body.galleryImageLink)
     //      product.images.gallery.links = req.body.galleryImageLink || undefined

     console.log("Update Product")

     let filterQuery = {slug: req.params.slug}

     Product.findOne(filterQuery)
     .then(product=>{
          if(!product)
               return res.json({
                    success: false,
                    message: "No product found"
               }) 
          if(product.vendor != req.user.id)
               return res.json({
                    success: false,
                    message: "Vendor not authorized for this product"
               }) 
          Product.findByIdAndUpdate(product._id, update).then(updated=>{
               return res.json({
                    success: true,
                    message: "Successfully updated",
                    data: updated
               })
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const remove = (req, res)=>{
     let filterQuery = {slug: req.params.slug}
     Product.findOne(filterQuery)
     .then(product=>{
          if(!product)
               return res.json({
                    success: false,
                    message: "No product found"
               })    
          if(product.vendor != req.user.id)
               return res.json({
                    success: false,
                    message: "Vendor not authorized for this product"
               })          
          Product.findByIdAndDelete(product._id).then(deleted=>{
               
               Vendor.findByIdAndUpdate(deleted.vendor, { $pull: { products: deleted._id } }).then(data=>{
                    console.log("Removed from vendor products")
               }).catch(err=>{
                    console.log(err)
               })

               return res.json({
                    success: true,
                    message: "Successfully deleted",
                    deleted
               })
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
     edit,
     remove,
}