const jwt=require('jsonwebtoken')
const jwtSecret = 'your-secret-key'

const handleGetUserByToken=async(req,res)=>{
    try {   
        const {token}=req.cookies
        const userData=jwt.verify(token,jwtSecret)
        if(!userData.userId){
            res.status(404).json("Error getting the user")
        }else{
            res.status(201).json(userData)
        }
    } catch (error) {
        console.log("Error getting the user",error)
    }
}

const handleCurrentUser=async(req,res)=>{
    const {userId}=req.query
    if(userId){
        try {
            const user=await Register.findById(userId)
            return res.status(201).json(user)
        } catch (error) {
            console.log("Error getting the user",error)
        }
    }
}

module.exports={
    handleGetUserByToken,
    handleCurrentUser
}