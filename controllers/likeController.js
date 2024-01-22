const jwt=require('jsonwebtoken')
const jwtSecret = 'your-secret-key'
const Like=require('../db/like')

const handleLike=async(req,res)=>{
    const {token}=req.cookies
    const id=req.body.data.id
    try {   
        const userData=jwt.verify(token,jwtSecret)
        const existingLike = await Like.findOne({postId:id,userId:userData.userId});
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            res.status(200).json({ message: 'Like removed' });
        } else {
        const addLike = new Like({
            postId:id,
            userId: userData.userId,
        })
            await addLike.save()
            res.status(201).json(userData.userId)
        }
    } catch (error) {
        console.log("Error deleting the post from database",error)
    }
}

const handleGetLikes=async(req,res)=>{
    try {
        const response=await Like.find()
        res.status(201).json(response)
    } catch (error) {
        console.log("Error getting teh like from database",error)
    } 
}

module.exports={
    handleLike,
    handleGetLikes
}