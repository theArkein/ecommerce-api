const fs = require('fs')

const ChildCategory = require('@models/childCategory')
const SubCategory = require('@models/subCategory')

const validate = require('@middlewares/Admin/category')

const slugify = require('slugify')

const saveImage = require('@config/saveImage')
const deleteImage = require('@config/deleteImage')

const list = (req, res)=>{

     ChildCategory.find().populate('grandParent parent', 'name slug icon')
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
     // Validate Request data
     let errors = validate.childCategoryCreate(req.body)
     if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {name, parent, grandParent, icon} = req.body
     let slug = slugify(name, {lower: true})
     let category = new ChildCategory({name, slug, parent, grandParent})
     if(icon){
          categoryIcon = `images/child-category/icons/${slug}.png`
          category.icon = categoryIcon
     }
     category.save().then(created=>{
          console.log("saved")
          if(icon){
               saveImage(icon , categoryIcon)
          }
          // Add to parent category
          SubCategory.findByIdAndUpdate(parent, { $push: { children: created._id } }).then(data=>{
               console.log("Added to parent category")
          })
          
          res.json({
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
     // Validate Request data
     let errors = validate.childCategoryEdit(req.body)
     if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
     let {name, icon} = req.body
     let slug = slugify(name, {lower: true})
     let update = {name, slug}
     if(icon){
          categoryIcon = `images/child-category/icons/${slug}.png`
          update.icon = categoryIcon
     }
     let filterQuery = {_id: req.params.id}
     ChildCategory.findOneAndUpdate(filterQuery, update)
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
          res.json({
               success: true,
               message: "Successfully updated",
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
     ChildCategory.findOneAndDelete(filterQuery).then(deleted=>{
          if(!deleted)
          return res.json({
               success: false,
               message: "No such category found"
          })
          if(deleted.icon)
               deleteImage(deleted.icon)
          SubCategory.findByIdAndUpdate(deleted.parent, { $pull: { children: deleted._id } }).then(data=>{
               console.log("Removed from parent category")
          }).catch(err=>{
               console.log(err)
          })
          res.json({
               success: true,
               message: "Successfully deleted",
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: "Somehting went wrong",
               errors: err.errors
          })
     })
}

const removeAll = (req, res)=>{
     console.log("Remove All")
     ChildCategory.deleteMany({}).then(data=>{
          console.log("All Categories Deleted")
          fs.rmdir('images/child-category/icons', (err)=>{
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