
import {db} from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';

export const register = (req,res)=>{
   const q="select * from users where email=?";
   db.query(q,[req.body.email],(err,data)=>{
        if(err) return res.json(err)
        if(data.length) return res.status(404).json("User already exists!")
        //Hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
       
        const q="INSERT INTO  users(`username`,`email`,`password`) VALUES(?)"
        const values=[
            req.body.username,
            req.body.email,
            hash ,
         ]
         db.query(q,[values],(err,data)=>{
            if(err) return res.json(err);
            return res.status(200).json("User has been created.")
            setEmail(req.body.email);
         })
   })
}
const sendEmail = async (email) => {
   const transporter = nodemailer.createTransport({
     host: 'smtp.example.com',
     port: 587,
     secure: false,
     auth: {
       user: 'ritu.rawal@acldigital.com',
       pass: 'Raunav@180210',
     },
   });
   const message="Press below link to verify user id."
   const mailOptions = {
     from: 'ritu.rawal@acldigital.com',
     to: email,
     subject: 'Hello from ReactJS',
     text: message,
   };

   try {
     await transporter.sendMail(mailOptions);
     console.log('Email sent successfully');
   } catch (error) {
     console.error('Error sending email:', error);
   }
}
export const login = (req,res)=>{
   console.log(req)
   const q="select * from users where email=? and status='1'"
   console.log(q)
   db.query(q,[req.body.username],(err,data)=>{
      if(err) return res.json(err)
      if(data.length===0) return res.status(404).json("User not found!")
      //check password
      const isPasswordCorrect= bcrypt.compareSync(req.body.password,data[0].password)

      if(!isPasswordCorrect) return res.status(400).json("Wrong username and password!");

      const token=jwt.sign({id:data[0].id},"jwtkey");
      const {password,...other}=data[0]
     
      res.cookie("access_token",token,{
         httpOnly:true
      }).status(200).json(data[0])
   })
}

export const logout = (req,res)=>{
    res.clearCookie("access_token",{
      sameSite:'none',
      secure:true
    }).status(200).json("User has been logout")
}