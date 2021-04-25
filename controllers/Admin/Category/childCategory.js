const ChildCategory = require('@models/childCategory')
const SubCategory = require('@models/subCategory')

const validate = require('@middlewares/admin/category')

const slugify = require('slugify')

const list = (req, res)=>{

     ChildCategory.find()
     .then(categories=>{
          res.json({
               status: true,
               results: categories.length,
               data: categories
          })
     }).catch(err=>{
          res.json({
               status: false,
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

     let {name, parent, grandParent} = req.body
     let slug = slugify(name, {lower: true})
     let category = new ChildCategory({name, slug, parent, grandParent})
     category.save().then(created=>{
          console.log("saved")
          // Add to parent category
          SubCategory.findByIdAndUpdate(parent, { $push: { children: created._id } }).then(data=>{
               console.log("Added to parent category")
          })
          
          res.json({
               status: true,
               message: "Successfully created",
               created
          })
     }).catch(err=>{
          res.json({
               status: false,
               message: "Failed to create",
               error: err
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
     let {name} = req.body
     let slug = slugify(name, {lower: true})
     let update = {name, slug}
     let filter = {slug: req.params.slug}
     ChildCategory.findOneAndUpdate(filter, update)
     .then(updated=>{
          res.json({
               status: true,
               message: "Successfully updated",
               updated
          })
     }).catch(err=>{
          res.json({
               status: false,
               message: "Failed to update",
               error: err
          })
     })
}
const removeOne = (req, res)=>{
     let filter = {slug: req.params.slug}
     ChildCategory.findOneAndDelete(id).then(deletedCategory=>{
          SubCategory.findByIdAndUpdate(deletedCategory.parent, { $pull: { children: deletedCategory._id } }).then(data=>{
               console.log("Removed from parent category")
          }).catch(err=>{
               console.log(err)
          })
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
     console.log("Rmeove All")
     ChildCategory.deleteMany({}).then(data=>{
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