import express from 'express'
import { createAppointment, deleteAppointment, viewAppointments } from '../appointment.controller.js'
import upload from '../../../utils/cloudinary_upload.js'
const appointmentRoute = express.Router()
appointmentRoute.post('/create', upload.single('payment_proof_image'), createAppointment)
appointmentRoute.get('/view', viewAppointments)
appointmentRoute.post('/delete/:id', deleteAppointment)



export default appointmentRoute