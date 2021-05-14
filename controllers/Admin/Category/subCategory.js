const fs = require('fs')

const SubCategory = require('@models/subCategory')
const MainCategory = require('@models/mainCategory')
const ChildCategory = require('@models/childCategory')

const validate = require('@middlewares/Admin/category')

const saveImage = require('@config/saveImage')
const deleteImage = require('@config/deleteImage')
const slugify = require('slugify')

const list = (req, res)=>{
     let populateQuery = { path: 'parent children', select: 'name slug icon'}

     SubCategory.find()
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
     // Validate Request data
     let errors = validate.subCategoryCreate(req.body)
     if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {name, parent, icon} = req.body
     let slug = slugify(name, {lower: true})
     let category = new SubCategory({name, slug, parent})
     if(icon){
          categoryIcon = `images/sub-category/icons/${slug}.png`
          category.icon = categoryIcon
     }
     category.save().then(created=>{
          // Add to parent category
          MainCategory.findByIdAndUpdate(parent, { $push: { children: created._id } }).then(data=>{
               console.log("Added to parent category")
          })
          // save new image
          if(icon){
               saveImage(icon , categoryIcon)
          }
          res.json({
               success: true,
               message: "Successfully created",
               created
          })
     }).catch(err=>{
          return res.json({
               success: false,
               message: (err.code == 11000 )? "Category with such name already exists" : "Somehting went wrong",
               errors: err.errors
          })
     })
}

const edit = (req, res)=>{
     // Validate Request data
     let errors = validate.subCategoryEdit(req.body)
     if(errors)
        return res.json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {name, icon} = req.body
     let slug = slugify(name, {lower: true})
     let filterQuery = {_id: req.params.id}
     let update = {name, slug, icon}
     if(icon){
          categoryIcon = `images/sub-category/icons/${slug}.png`
          update.icon = categoryIcon
     }
     SubCategory.findOneAndUpdate(filterQuery, update)
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
     SubCategory.findOneAndDelete(filterQuery)
     .then(deleted=>{
          if(!deleted)
               return res.json({
                    success: false,
                    message: "No such category found"
               })
               if(deleted.icon)
                    deleteImage(deleted.icon)

          MainCategory.findByIdAndUpdate(deleted.parent, { $pull: { children: deleted._id } }).then(data=>{
               console.log("Removed from parent category")
          }).catch(err=>{
               console.log(err)
          })
          
          ChildCategory.deleteMany({parent: deleted._id}).then(data=>{
               console.log("All Child Category Removed")
          }).catch(err=>{
               console.log(err)
          })

          res.json({
               success: true,
               message: "Successfully deleted",
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
     SubCategory.deleteMany({}).then(data=>{
          console.log("All Categories Deleted")
          fs.rmdir('images/sub-category/icons', (err)=>{
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