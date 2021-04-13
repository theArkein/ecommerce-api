const SubCategory = require('../../models/subCategory')
const MainCategory = require('../../models/mainCategory')
const ChildCategory = require('../../models/childCategory')

const slugify = require('slugify')

const list = (req, res)=>{
     SubCategory.find()
     .select('name slug')
     .populate({ path: 'children' , select: 'name slug'})
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

     SubCategory.findByIdAndUpdate(id, {name, slug, icon} ).then(updated=>{
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
     SubCategory.findByIdAndRemove(id).then(deletedCategory=>{
          
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