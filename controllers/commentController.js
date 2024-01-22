const jwt=require('jsonwebtoken')
const CommentModel=require('../db/comment')
const jwtSecret = 'your-secret-key'

const handleComment=async(req,res)=>{
    const {token}=req.cookies
    const {message,postId,postedBy}=req.body
    console.log(postedBy)
    try {
        const userData=jwt.verify(token,jwtSecret)
        const addComment=new CommentModel({
            message:message,
            postId:postId,
            userId:userData.userId,
            postedBy:postedBy
        })
        const saveComment=await addComment.save()
        res.status(201).json(saveComment)
        console.log("Comment created successfully")
    } catch (error) {
        console.log("Error sendinf comment to the database",error)
    }
}

const handleGetComments=async(req,res)=>{
    const {postId}=req.query
    try {
        const response=await CommentModel.find({postId:postId})
        if(!response){
            res.status(404).json("Error")
        }else{
            res.status(201).json(response)
        }
    } catch (error) {
        console.log("Error getting the comments",error)
    }
}

module.exports={
    handleComment,
    handleGetComments
}