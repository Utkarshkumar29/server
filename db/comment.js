const mongoose=require('mongoose')

const CommentSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    postId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    postedBy:{
        type:String,
        required:true
    }
})

const CommentModel = mongoose.model('Comment',CommentSchema)

module.exports = CommentModel
