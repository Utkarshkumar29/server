const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const multer=require('multer')
const fs=require('fs')

app.use(express.json())
app.use(cookieParser())
require('dotenv').config()
app.use('/uploads',express.static(__dirname+'/'))


const authController=require('./controllers/authController')
const postController=require('./controllers/postContoller')
const likeController=require('./controllers/likeController')
const getUSerController=require('./controllers/getUserController')
const commentController=require('./controllers/commentController')

mongoose.connect(process.env.MongoDB_URL).then(() => {
    console.log("MongoDB Connected")
}).catch((error) => {
    console.log(error)
})

app.get('/',(req,res)=>{
    res.json("Hello World")
})

const photosMiddleware=multer({dest:'uploads/'})

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadFiles);
})

app.post('/register', authController.handleUserRegistration)
app.post('/login',authController.handleUserLogin)
app.post('/changePassword',authController.handleUpdatePassword)

app.post('/post',postController.handlePost)
app.get('/fetchUserPost',postController.handleFetchUserPost)
app.get('/feed',postController.handleFeed)
app.delete('/delete',postController.handleDelete)
app.get('/getpost/:id',postController.handleGetIdPost)
app.put('/updatePost/:id',postController.handleUpdatePost)

app.post('/like',likeController.handleLike)
app.get('/getLikes',likeController.handleGetLikes)


app.get('/currentUser',getUSerController.handleCurrentUser)
app.get('/getCurrentUserByToken',getUSerController.handleGetUserByToken)

app.post('/comment',commentController.handleComment)
app.get('/getComments',commentController.handleGetComments)


app.listen(4000,()=>{
    console.log("Connected to the server at 4000")
})  