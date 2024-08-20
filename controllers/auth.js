
import {db} from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';
import crypto from 'crypto';
// Function to register a new user
export const register = (req, res) => {
   const q = "SELECT * FROM users WHERE email=?";
   console.log(q);
   db.query(q, [req.body.email], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(404).json("User already exists!");

        // Hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const token = crypto.randomBytes(32).toString('hex');
        const q = "INSERT INTO users(`username`, `email`, `password`,`verification_token`) VALUES (?)";
        const values = [
            req.body.username,
            req.body.email,
            hash,
            token
        ];
        db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            // Send the verification email
            sendEmail (req.body.email,token);
            return res.status(200).json("User has been created.");
        });
   });
};
// Function to send a verification email
 const sendEmail  = async (email,token) => {
   const transporter = nodemailer.createTransport({
    //  host: 'smtp.gmail.com', // Replace with your SMTP server details
    //  port: 587,
    //  secure: false,
     service: 'gmail',
     auth: {
       user: 'rrrawal82@gmail.com', // Replace with your SMTP user
       pass: 'avde azit uvfv zwxf', // Replace with your SMTP password
     },
   });
   const verificationUrl = `http://localhost:8080/api/auth/verifyEmail?token=${token}`;
   const message = `Please verify your email by clicking on the following link: ${verificationUrl}`;
   const mailOptions = {
      from: 'rrrawal82@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: message,
    };

   try {
     await transporter.sendMail(mailOptions);
     console.log('Email sent successfully');
   } catch (error) {
     console.error('Error sending email:', error);
   }
};
export const verifyEmail = (req, res) => {
   const { token } = req.query;
   console.log(req);
   if (!token) return res.status(400).json("Token is required");
   
   const q = "SELECT * FROM users WHERE `verification_token`=?";
   console.log(q);
   db.query(q, [token], (err, data) => {
       if (err) return res.json(err);
       if (data.length === 0) return res.status(404).json("Invalid or expired token");

       const user = data[0];
       if (user.status === '1') return res.status(400).json("User is already verified");

       // Update user status to verified and clear the verification token
       const q = "UPDATE users SET status='1', verification_token=NULL WHERE id=?";
       db.query(q, [user.id], (err, data) => {
           if (err) return res.json(err);
           res.status(200).json("Email verified successfully");
       });
   });
};
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