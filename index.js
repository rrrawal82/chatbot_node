import express from "express"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import cookieParser from "cookie-parser"
import cors from 'cors';

const app = express()
 const corsOptions ={
     origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
     optionSuccessStatus:200
 }
 app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes) 
app.use("/api/users",userRoutes) 
app.use("/api/posts",postRoutes) 

app.listen(8080,()=>{
    console.log("connected")

})