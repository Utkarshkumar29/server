const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const RegisterModel = require('../db/register')
require('dotenv').config()
const jwtSecret = 'your-secret-key'


handleUserRegistration=async(req,res)=>{
    const {name,email,password,image}=req.body
    const hashedPassword=await bcrypt.hash(password,10)
    try {
        const user=new RegisterModel({
            name:name,
            email:email,
            password:hashedPassword,
            image:image
        })
        const response=await user.save()
        jwt.sign({userId:response._id,name,email,image},jwtSecret,{},async(err,token)=>{
            if(err){
                throw err  
            }else{
                res.cookie('token',token).json(token)
                console.log(token)
            } 
        })
        console.log(response)
    } catch (error) {
        console.log("Error adding the User to the database:",error)
        res.status(500).json({ error: "Error adding the user to the database" });
    }
}

const handleUserLogin=async(req,res)=>{
    const {email,password}=req.body
    try {
        const userDocs=await RegisterModel.findOne({email})
        if(userDocs){
            const validPassord=bcrypt.compareSync(password,userDocs.password)
            if(validPassord){
                jwt.sign({
                    userId:userDocs._id,
                    name:userDocs.name,
                    email:userDocs.email
                },jwtSecret,{},(err,token)=>{
                    if(err){
                        throw err
                    }else{
                        res.status(200).cookie('token',token).json(token)
                        console.log('User logged in successfully:')
                    }
                })
            }else{
                return res.status(401).json({message:"Invalid Password!"})
            }
        }else{
            res.status(404).json({message:'User not found'});
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
}

const handleUpdatePassword=async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await RegisterModel.findOne({email})
        if(!user){
            return res.status(404).json("Email not found")
        }else{
            const hashedPassword=await bcrypt.hash(password,10)
            user.set({
                password:hashedPassword
            })
            const response=await user.save()
            if(response){
                res.status(201).json("Password updated successfully")
            }
        }
    } catch (error) {
        console.log("Error updating the password",error)
    }
}

module.exports = {
    handleUserRegistration,
    handleUserLogin,
    handleUpdatePassword
  }