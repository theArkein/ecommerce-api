const Product = require('../../models/product')
const MainCategory = require('../../models/main-category')

const list = (req, res)=>{
     Product.find({'publish': true})
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .then(products=>{
          res.json({
               status: true,
               results: products.length,
               data: products
          })
     }).catch(err=>{
          res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const listById = (req, res)=>{
     let id = req.params.id
     Product.findOne({_id: id, status: true})
     .populate('mainCategory', 'name slug icon')
     .populate('subCategory', 'name slug')
     .populate('childCategory', 'name slug')
     .then(product=>{
          res.json({
               status: true,
               data: product
          })
     }).catch(err=>{
          res.json({
               status: true,
               message: "Something went wrong",
               error: err
          })
     })
}

const create = (req, res)=>{
     let product = {
          name: req.body.name,
          shortName: req.body.shortName,
          sku: req.body.sku,
          price: req.body.price,
          stock: req.body.stock,
          publish: (req.body.publish === 'false')?false:true,
          status: req.body.status || 1,
          mainCategory: req.body.mainCategory,
          subCategory: req.body.subCategory,
          childCategory: req.body.childCategory,
          images: {
               featured: {
                    path: undefined,
                    link: undefined
               },
               gallery: {
                    paths: [],
                    links: []
               }
          },
          variants: {
               types: req.body.variants
          }
     }
     // Format variants in one object form
     product.variants.types.forEach(variant => {
          console.log(variant)
          product.variants[`${variant}`] = {
               types: req.body[`${variant}Type`],
               price: req.body[`${variant}Price`]
          }
     });
     let images = req.files
     
     // Save images paths
     if(images.length){
          // save featuredImage path if provided
          if(images[0].fieldname == "featuredImage"){
               product.images.featured.path = images[0].filename
               // save galleryImage paths if provided and featured image Exits
               if(images.length>=2){
                    for(let i=1; i<images.length; i++){
                         product.images.gallery.paths.push(images[i].filename)
                    }
               } else {
                    product.images.gallery.paths = undefined
               }
          }else {
               // save galleryImage paths if provided and featured image doesnot Exits
               if(images.length>=2){
                    for(let i=0; i<images.length; i++){
                         product.images.gallery.paths.push(images[i].filename)
                    }
               } else {
                    product.images.gallery.paths = undefined
               }
          }
     }

     if(req.body.featuredImageLink)
          product.images.featured.link = req.body.featuredImageLink

     if(req.body.galleryImageLink)
          product.images.gallery.links = req.body.galleryImageLink || undefined

     let newProduct = new Product(product)
     newProduct.save().then(created=>{
          res.json({
               status: true,
               message: "Successfully created",
               data: created
          })
     }).catch(err=>{
          res.json({
               status: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const edit = (req, res)=>{
     let id = req.params.id
     let product = {
          name: req.body.name,
          shortName: req.body.shortName,
          sku: req.body.sku,
          price: req.body.price,
          stock: req.body.stock,
          publish: (req.body.publish === 'false')?false:true,
          status: req.body.status || 1,
          mainCategory: req.body.mainCategory,
          subCategory: req.body.subCategory,
          childCategory: req.body.childCategory,
          images: {
               featured: {
                    path: undefined,
                    link: undefined
               },
               gallery: {
                    paths: [],
                    links: []
               }
          },
          variants: {
               types: req.body.variants
          }
     }
     // Format variants in one object form
     product.variants.types.forEach(variant => {
          console.log(variant)
          product.variants[`${variant}`] = {
               types: req.body[`${variant}Type`],
               price: req.body[`${variant}Price`]
          }
     });
     let images = req.files
     
     // Save images paths
     if(images.length){
          // save featuredImage path if provided
          if(images[0].fieldname == "featuredImage"){
               product.images.featured.path = images[0].filename
               // save galleryImage paths if provided and featured image Exits
               if(images.length>=2){
                    for(let i=1; i<images.length; i++){
                         product.images.gallery.paths.push(images[i].filename)
                    }
               } else {
                    product.images.gallery.paths = undefined
               }
          }else {
               // save galleryImage paths if provided and featured image doesnot Exits
               if(images.length>=2){
                    for(let i=0; i<images.length; i++){
                         product.images.gallery.paths.push(images[i].filename)
                    }
               } else {
                    product.images.gallery.paths = undefined
               }
          }
     }

     if(req.body.featuredImageLink)
          product.images.featured.link = req.body.featuredImageLink

     if(req.body.galleryImageLink)
          product.images.gallery.links = req.body.galleryImageLink || undefined

     Product.findByIdAndUpdate(id).then(updated=>{
          res.json({
               status: true,
               message: "Successfully updated",
               data: updated
          })
     }).catch(err=>{
          res.json({
               status: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const removeOne = (req, res)=>{
     let id = req.params.id
     console.log("Remove One")
     Product.findByIdAndRemove(id).then(deleted=>{             
          res.json({
               status: true,
               message: "Successfully deleted",
               deleted
          })
     }).catch(err=>{
          res.json({
               status: false,
               message: "Something went wrong",
               deleted
          })
     })
}

const removeAll = (req, res)=>{
     console.log("Remove All")
     Product.deleteMany({}).then(data=>{
          console.log("All products deleted")
          res.json(data)
     }).catch(err=>{
          console.log(err)
     })
}

module.exports = {
     list,
     listById,
     create,
     edit,
     removeOne,
     removeAll
}