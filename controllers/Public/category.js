const ChildCategory = require('@models/childCategory')
const SubCategory = require('@models/subCategory')
const MainCategory = require('@models/mainCategory')

const slugify = require('slugify')

// main
const listMain = (req, res)=>{
     let filterQuery = {publish: true}
     let selectQuery = 'name slug icon'
     let populateQuery = { 
          path: 'children', 
          match: { publish: true }, 
          select: 'name slug icon', 
          populate: { path: 'children' , 
          match: { publish: true }, 
          select: 'name slug icon'}
     }

     MainCategory.find(filterQuery)
     .select(selectQuery)
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

// sub
const listSub = (req, res)=>{
     let filterQuery = {
          publish: true,
          slug: req.params.main
     }
     let selectQuery = 'name slug icon'
     let populateQuery = { 
          path: 'children', 
          match: { publish: true }, 
          select: 'name slug icon'
     }
     
     MainCategory.findOne(filterQuery)
     .select(selectQuery)
     .populate(populateQuery)
     .then(categories=>{
          res.json({
               success: true,
               results: categories.length,
               data: categories.children
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}

// child
const listChild = (req, res)=>{
     let filterQuery = {
          publish: true,
          slug: req.params.sub
     }
     let selectQuery = 'name slug icon'
     let populateQuery = { 
          path: 'children', 
          match: { publish: true }, 
          select: 'name slug icon'
     }

     SubCategory.findOne(filterQuery)
     .select(selectQuery)
     .populate(populateQuery)
     .then(categories=>{
          res.json({
               success: true,
               results: categories.length,
               data: categories.children
          })
     }).catch(err=>{
          res.json({
               success: false,
               message: "Something went wrong",
               error: err
          })
     })
}
module.exports = {
     listMain,
     listSub,
     listChild
}