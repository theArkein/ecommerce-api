const SubCategory = require('@models/subCategory')
const MainCategory = require('@models/mainCategory')
const ChildCategory = require('@models/childCategory')

const validate = require('@middlewares/Admin/category')

const slugify = require('slugify')

const list = (req, res)=>{
     let populateQuery = { path: 'children'}

     SubCategory.find()
     .populate(populateQuery)
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
     let errors = validate.subCategoryCreate(req.body)
     if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {name, parent} = req.body
     let slug = slugify(name, {lower: true})
     let category = new SubCategory({name, slug, parent})
     category.save().then(created=>{
          // Add to parent category
          MainCategory.findByIdAndUpdate(parent, { $push: { children: created._id } }).then(data=>{
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
               message: err.message,
               error: err.errors
          })
     })
}

const edit = (req, res)=>{
     // Validate Request data
     let errors = validate.subCategoryEdit(req.body)
     if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

     let {name} = req.body
     let slug = slugify(name, {lower: true})
     let filter = {slug: req.params.slug}
     let update = {name, slug}
     SubCategory.findOneAndUpdate(filter, update)
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
     SubCategory.findOneAndDelete(filter)
     .then(deletedCategory=>{
          
          MainCategory.findByIdAndUpdate(deletedCategory.parent, { $pull: { children: deletedCategory._id } }).then(data=>{
               console.log("Removed from parent category")
          }).catch(err=>{
               console.log(err)
          })
          
          ChildCategory.deleteMany({parent: deletedCategory._id}).then(data=>{
               console.log("All Child Category Removed")
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
     SubCategory.deleteMany({}).then(data=>{
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