const mongoose=require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.MongoDB_URL).then(() => {
    console.log("MongoDB Connected")
}).catch((error) => {
    console.log(error)
})