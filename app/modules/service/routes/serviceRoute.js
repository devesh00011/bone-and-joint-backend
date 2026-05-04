import express from 'express'
import { addService, addServicesVideos, deleteService, getServiceDatabyId, updateServiceById, UpdateServicesVideos, viewService, viewServiceById } from '../service.controller.js'
import upload from '../../../utils/cloudinary_upload.js'
const serviceRoute = express.Router()

//service main api's
serviceRoute.post('/add', upload.single('service_image'), addService)
serviceRoute.get('/view', viewService)
serviceRoute.get('/view/:id', viewServiceById)
serviceRoute.post('/update/:id', upload.single('service_image'), updateServiceById)
serviceRoute.post('/delete/:id', deleteService)

//service content like videos api's
serviceRoute.post('/upload-videos', addServicesVideos)
serviceRoute.post('/update-videos', UpdateServicesVideos)
serviceRoute.get('/view-service-videos/:id', getServiceDatabyId)


export default serviceRoute