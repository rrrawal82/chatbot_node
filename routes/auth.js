import express from "express"
import { register , login , logout,verifyEmail  } from "../controllers/auth.js"

const router =express.Router()

router.post("/register",register)
router.get("/verifyEmail", verifyEmail);
router.post("/login",login)
router.post("/logout",logout)

export default router