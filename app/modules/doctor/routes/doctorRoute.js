import express from "express";
import { deleteDoctor, saveDoctor, updateDoctor, viewDoctor, viewDoctorById, viewDoctorBySlug } from "../doctor.controller.js";
import upload from "../../../utils/cloudinary_upload.js";
const doctorRoute = express.Router()
doctorRoute.post('/add', upload.single('profile_image'), saveDoctor)
doctorRoute.get('/view', viewDoctor)
doctorRoute.get('/specific/:slug', viewDoctorBySlug)
doctorRoute.post('/delete/:id', deleteDoctor)
doctorRoute.get('/view/:docId', viewDoctorById)
doctorRoute.post('/update/:docId', upload.single('profile_image'), updateDoctor)



export default doctorRoute;