const Product = require("@models/product")
const Comment = require("@models/comment")
const CommentValidation = require("@middlewares/User/comment")

const list = (req, res)=>{
    let filterQuery = {
        commentor: req.user.id,
        parentComment: null
    }
    Comment.find(filterQuery)
    .then(comment=>{
        return res.json({
            success: true,
            data: comment
        })
    }).catch(err=>{
        return res.json({
            success: false,
            message: err.message,
            error: err.errors
        })
    })
}

const add = (req, res)=>{
    let errors = CommentValidation.add(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })

    let comment = new Comment(req.body)
    comment.commentor = req.user.id

    console.log(comment)
    if(comment.parentComment){
        Comment.findByIdAndUpdate(comment.parentComment, {$push: {subComments: comment.id}}).then(updated=>{
            if(!updated){
                return res.json({
                    success: false,
                    message: "No such parent comment"
                })
            }
            comment.save().then(saved=>{
                return res.json({
                    success: true,
                    message: "Successfully added",
                    data: saved
                })
            })
        }).catch(err=>{
            return res.json({
                success: false,
                message: err.message,
                error: err.errors
            })
        })
    } else {
        Product.findByIdAndUpdate(comment.product, {$push: {comments: comment}}).then(updated=>{
            if(!updated){
                return res.json({
                    success: false,
                    message: "No such product found"
                })
            }
            comment.save().then(saved=>{
                return res.json({
                    success: true,
                    message: "Successfully added",
                    data: saved
                })
            })
        }).catch(err=>{
            return res.json({
                success: false,
                message: err.message,
                error: err.errors
            })
        })
    }


}

const update = (req, res)=>{
    let errors = CommentValidation.update(req.body)
    if(errors)
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
    
    let update = req.body
    Comment.findByIdAndUpdate(req.params.id, update).then(updated=>{
        if(!updated){
            return res.json({
                success: false,
                message: "No such comment found"
            })
        }
    }).catch(err=>{
        return res.json({
            success: false,
            message: err.message,
            error: err.errors
        })
    })

}

remove = (req, res)=>{
    let filterQuery = {
        _id: req.params.id, 
        commentor: req.user.id
    }

    Comment.findOneAndDelete(filterQuery).then(deleted=>{
        if(!deleted){
            return res.json({
                success: false,
                message: "No such comment found",
            })
        }
        if(deleted.parentComment){
            Comment.findByIdAndUpdate(deleted.parentComment, {$pull: {subComments: req.params.id}}).then(updated=>{
                if(updated)
                    console.log("Comment removed from parent comment")
            })
        } else {
            Product.findByIdAndUpdate(deleted.product, {$pull: {comments: req.params.id}}).then(updated=>{
                if(updated)
                    console.log("Comment removed from product comments")
            })
        }

        if(deleted.subComments.length){
            deleted.subComments.forEach(item=>{
                Comment.findByIdAndDelete(item).exec()
            })
            console.log("subComments deleted")
        }

        return res.json({
            success: true,
            message: "Successfully deleted"
        })
            
    })
}

module.exports = {
    list,
    add,
    update,
    remove
}