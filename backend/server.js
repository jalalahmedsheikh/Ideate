import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRoutes from './routes/user.route.js'
import postRouters from './routes/post.route.js'
import pollRouter from './routes/poll.route.js'
import PostsPollsRoute from './routes/posts-polls.route.js'
import database from "./config/db.connect.js"
// import path from "path";
dotenv.config({})

const app = express()
const port = process.env.PORT || 3000
// const __dirname = path.resolve();

//Defualt middlewares
app.use(express.json())
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

app.use("/user",userRoutes)
app.use("/post",postRouters)
app.use("/poll",pollRouter)
app.use("/feed",PostsPollsRoute)



// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req,res)=>{
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// })


app.listen(port,()=>{
    database()
    console.log(`Server running at port ${port}`);    
})


// http://localhost:8000/api/v1/user/register
//  127.0.0.1:8000
// { 
//     "username": "ahmed", 
//     "email": "jalal@gmail.com", 
//     "password":"123456" 
// }