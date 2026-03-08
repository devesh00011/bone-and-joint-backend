import express from 'express'
import { addService, deleteService, updateServiceById, viewService, viewServiceById } from '../service.controller.js'
import upload from '../../../utils/cloudinary_upload.js'
const serviceRoute = express.Router()
serviceRoute.post('/add', upload.single('service_image'), addService)
serviceRoute.get('/view', viewService)
serviceRoute.get('/view/:id', viewServiceById)
serviceRoute.post('/update/:id', upload.single('service_image'), updateServiceById)
serviceRoute.post('/delete/:id', deleteService)



export default serviceRoute