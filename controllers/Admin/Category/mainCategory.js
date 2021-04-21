const MainCategory = require('@models/mainCategory')
const SubCategory = require('@models/subCategory')
const ChildCategory = require('@models/childCategory')

const slugify = require('slugify')

const list = (req, res)=>{
     
     let populateQuery = { path: 'children', populate: { path: 'children'}}

     MainCategory.find()
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
     let {name} = req.body
     let slug = slugify(name, {lower: true})
     console.log(req.files)

     let icon = null
     if(req.files.length)
          icon = "images/" + req.files[0].filename

     let category = new MainCategory({name, slug, icon})
     console.log(category)
     category.save().then(created=>{
          res.json({
               status: true,
               message: "Successfully created",
               created
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
     let {name} = req.body
     let slug = slugify(name, {lower: true})
     let category = {name, slug}
     
     if(req.files.length)
          category.icon = "images/" + req.files[0].filename

     console.log(category)
     MainCategory.findByIdAndUpdate(id, category)
     .then(updated=>{
          if(!updated)
               res.json({
                    status: false,
                    message: "No such category found"
               })

          res.json({
               status: true,
               message: "Successfully updated"
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