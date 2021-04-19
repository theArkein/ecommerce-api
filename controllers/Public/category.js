const ChildCategory = require('../../models/childCategory')
const SubCategory = require('../../models/subCategory')
const MainCategory = require('../../models/subCategory')

const slugify = require('slugify')

// main
const listMain = (req, res)=>{

     let selectQuery = 'name slug'
     let populateQuery = { path: 'children',select: 'name slug', populate: { path: 'children' , select: 'name slug'}}

     MainCategory.find()
     .select(selectQuery)
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

// sub
const listSub = (req, res)=>{

     let selectQuery = 'name slug'
     let populateQuery = { path: 'children',select: 'name slug'}
     
     SubCategory.find()
     .select(selectQuery)
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

// child
const listChild = (req, res)=>{
     let selectQuery = 'name slug'

     ChildCategory.find()
     .select(selectQuery)
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
module.exports = {
     listMain,
     listSub,
     listChild
}