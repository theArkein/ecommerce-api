const uniqid = require('uniqid')
const slugify = require('slugify')

const MainCategory = require('@models/mainCategory')
const SubCategory = require('@models/subCategory')
const ChildCategory = require('@models/childCategory')

const validate = require('@middlewares/Admin/category')

const saveImage = require('@config/saveImage')

const list = (req, res)=>{
     
     let populateQuery = { path: 'children', populate: { path: 'children'}}

     MainCategory.find()
     .populate(populateQuery)
     .then(categories=>{
          res.json({
               success: true,
               results: categories.length,
               data: categories
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}

const create = (req, res)=>{

     // Validate request
     let errors = validate.mainCategoryCreate(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {name, icon, publish} = req.body
     let slug = slugify(name, {lower: true})

     let categoryIcon = `images/category/{uniqid()}${uniqid()}.png`
     saveImage(icon , categoryIcon)
     icon = categoryIcon

     let category = new MainCategory({name, slug, icon, publish})
     console.log(category)
     category.save().then(created=>{
          res.json({
               success: true,
               message: "Successfully created",
               created
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const edit = (req, res)=>{
     // Validate request
     let errors = validate.mainCategoryEdit(req.body)
     if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {name, icon, publish} = req.body
     let slug = slugify(name, {lower: true})
     let category = {name, slug, publish}
     let categoryIcon = null

     if(icon){
          categoryIcon = `images/category/${uniqid()}${uniqid()}.png`
          saveImage(icon , categoryIcon)
          category.icon = categoryIcon
     }

     let filter = {slug: req.params.slug} 
     MainCategory.findOneAndUpdate(filter, category)
     .then(updated=>{
          if(!updated)
               res.json({
                    success: false,
                    message: "No such category found"
               })

          res.json({
               success: true,
               message: "Successfully updated"
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: err.message,
               errors: err.errors
          })
     })
}

const removeOne = (req, res)=>{
     let filter = {slug: req.params.slug}
     MainCategory.findOneAndDelete(filter)
     .then(deleted=>{          
          console.log(deleted)
          SubCategory.deleteMany({parent: deleted._id}).then(data=>{
               console.log("All Child Category Removed")
          }).catch(err=>{
               console.log(err)
          })

          ChildCategory.deleteMany({grandParent: deleted._id}).then(data=>{
               console.log("All GrandChild Category Removed")
          }).catch(err=>{
               console.log(err)
          })
          
          res.json({
               success: true,
               message: "Successfully deleted",
               deleted
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               deleted
          })
     })
}

const removeAll = (req, res)=>{
     console.log("Remove All")
     MainCategory.deleteMany({}).then(data=>{
          console.log("All Categories Deleted")
          res.json(data)
     }).catch(err=>{
          console.log(err)
     })
}

module.exports = {
     list,
     create,
     edit,
     removeOne,
     removeAll
}