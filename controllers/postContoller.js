const jwt=require('jsonwebtoken')
const AddPost=require('../db/post')
const Register=require('../db/register')
const jwtSecret = 'your-secret-key'

const handlePost=async(req,res)=>{
    try {
        const {token}=req.cookies
        const {message,image,name,userId,email}=req.body
        console.log(name)
        const userData=jwt.verify(token,jwtSecret)
        const Post=new AddPost({
            postedBy:userData.userId,
            message:message,
            image:image,
            name:name,
            userId:userId,
            email:email
        })
    await Post.save()
    res.status(201).json({message:'Post created successfully'}) 
    console.log("Post created successfully")
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const handleFetchUserPost=async(req,res)=>{
    const {token}=req.cookies
    const userData=jwt.verify(token,jwtSecret)
    try {
        const response=await Register.findById(userData.userId)
        if(!response){
            res.status(401).json("User not found")
        }
        const posts=await AddPost.find({postedBy:response._id })
        if(!posts){
            res.status(201).json("User has yet to post")
        }
        res.status(201).json(posts)
    } catch (error) {
        console.log("Error getting user post from database",error)
    }
}

const handleFeed=async(req,res)=>{
    try {
        const response=await AddPost.find()
        if(!response){
            res.status(201).json("NO post available")
        }
        res.status(201).json(response)
    } catch (error) {
        console.log("Error getting all post from database",error)
    }
}

const handleDelete=async(req,res)=>{
    const id=req.body.id
    try {
        const response=await AddPost.findByIdAndDelete(id)
        console.log("deleted successfully")
        res.status(201).json("Deleted successsfully")
    } catch (error) {
        console.log("Error deleting the post from database",error)
    }
}

const handleGetIdPost=async(req,res)=>{
    let id=req.params.id
    id= id.replace(/^:/, '').replace(/:$/, '')
    try {
        const response=await AddPost.findById(id)
        if(!response){
            res.status(201).json("NO post available")
        }
        res.status(201).json(response)
    } catch (error) {
        console.log("Error deleting the post from database",error)
    }
}

const handleUpdatePost=async(req,res)=>{
    let id=req.params.id
    id= id.replace(/^:/, '').replace(/:$/, '')
    const {message,image}=req.body
    try {
        const response=await AddPost.findByIdAndUpdate(id)
        response.set({message,image})
        await response.save()
        res.status(201).json("Updation Successfull")
    } catch (error) {
        console.log("Error updating the database",error)
    }
}

module.exports={
    handlePost,
    handleFetchUserPost,
    handleFeed,
    handleDelete,
    handleGetIdPost,
    handleUpdatePost
}