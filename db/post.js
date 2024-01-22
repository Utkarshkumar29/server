const mongoose=require('mongoose')

const PostSchema=new mongoose.Schema({
    postedBy:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    image:{
        type:[String]   
    },
    createdAt:{
        type:Date,
        default:Date.now
    },name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
})

const PostModel=mongoose.model('post',PostSchema)

module.exports=PostModel
