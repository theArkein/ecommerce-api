const MainCategory = require('../../models/mainCategory')
const SubCategory = require('../../models/subCategory')
const ChildCategory = require('../../models/childCategory')

const slugify = require('slugify')

const list = (req, res)=>{
     MainCategory.find()
     .select('name slug')
     .populate({ path: 'children',select: 'name slug', populate: { path: 'children' , select: 'name slug'}})
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
     let {name} = req.body
     let slug = slugify(name, {lower: true})
     console.log(req.files)

     let icon = req.files[0].filename
     let category = new MainCategory({name, slug, icon})
     category.save().then(created=>{
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
     let category = {name, slug}
     
     if(req.files.length){
          let icon = req.files[0].filename
          category.icon = icon
     }
     MainCategory.findByIdAndUpdate(id, category ).then(updated=>{
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
     MainCategory.findByIdAndRemove(id).then(deleted=>{          
          
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