import express from 'express'
import { adminLogin, checkEmailnSendOtp, createNewPassword, resendOtp, verifyOtp, verifyOtpByEmail } from '../admin.controller.js'
const adminRoute = express.Router()
adminRoute.post('/login', adminLogin)
adminRoute.post('/verify-otp', verifyOtp)
adminRoute.post('/verify-otp-by-email', verifyOtpByEmail)
adminRoute.post('/resend-otp', resendOtp)
adminRoute.post('/send-otp-to-forgot', checkEmailnSendOtp)
adminRoute.post('/create-new-password', createNewPassword)




export default adminRoute