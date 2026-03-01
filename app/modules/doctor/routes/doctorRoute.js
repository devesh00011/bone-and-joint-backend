import express from "express";
import multer from "multer";
import { deleteDoctor, saveDoctor, viewDoctor, viewDoctorBySlug } from "../doctor.controller.js";
import upload from "../../../utils/cloudinary_upload.js";
const doctorRoute = express.Router()
doctorRoute.post('/add', upload.single('profile_image'), saveDoctor)
doctorRoute.get('/view', viewDoctor)
doctorRoute.get('/specific/:slug', viewDoctorBySlug)
doctorRoute.post('/delete/:id', deleteDoctor)
        


export default doctorRoute;