const fs = require('fs')
const slugify = require('slugify')
const MainCategory = require('@models/mainCategory')
const SubCategory = require('@models/subCategory')
const ChildCategory = require('@models/childCategory')

const validate = require('@middlewares/Admin/category')

const saveImage = require('@config/saveImage')
const deleteImage = require('@config/deleteImage')


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
     let category = new MainCategory({name, slug, publish})

     let categoryIcon = `images/main-category/icons/${slug}.png`
     category.icon = categoryIcon

     category.save().then(created=>{
          // save image
          saveImage(icon , categoryIcon)

          return res.json({
               success: true,
               message: "Successfully created",
               created
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: (err.code == 11000 )? "Category with such name already exists" : "Somehting went wrong",
               errors: err.err
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
          categoryIcon = `images/main-category/icons/${slug}.png`
          category.icon = categoryIcon
     }

     let filterQuery = {_id: req.params.id} 
     MainCategory.findOneAndUpdate(filterQuery, category)
     .then(updated=>{
          if(!updated)
               return res.json({
                    success: false,
                    message: "No such category found"
               })
          
          // save new image and delete previous image
          if(icon) {
               saveImage(icon , categoryIcon)
               deleteImage(updated.icon)
          }

          return res.json({
               success: true,
               message: "Successfully updated"
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: (err.code == 11000 )? "Category with such name already exists" : "Somehting went wrong",
               errors: err.err
          })
     })
}

const removeOne = (req, res)=>{
     let filterQuery = {_id: req.params.id}
     MainCategory.findOneAndDelete(filterQuery)
     .then(deleted=>{
          if(!deleted)
               return res.json({
                    success: false,
                    message: "No such category found"
               })
          deleteImage(deleted.icon)
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
          
          return res.json({
               success: true,
               message: "Successfully deleted",
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: "Something went wrong",
               error: err.errors
          })
     })
}

const removeAll = (req, res)=>{
     console.log("Remove All")
     MainCategory.deleteMany({}).then(data=>{
          console.log("All Categories Deleted")
          fs.rmdir('images/main-category/icons', (err)=>{
               if(err){
                    console.log(err)
               }
          })
          return res.json({
               success: true,
               message: "All categories successfully deleted"
          })
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