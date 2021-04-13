const ChildCategory = require('../../models/childCategory')
const SubCategory = require('../../models/subCategory')

const slugify = require('slugify')

const list = (req, res)=>{
     ChildCategory.find()
     .select('name slug')
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
     let id = req.params.id
     let {name} = req.body
     let slug = slugify(name, {lower: true})
     let icon = req.files[0].filename

     ChildCategory.findByIdAndUpdate(id, {name, slug, icon} ).then(updated=>{
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
     let id = req.params.id
     console.log("Remove One")
     ChildCategory.findByIdAndRemove(id).then(deletedCategory=>{
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