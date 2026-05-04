import express from "express";
import { addAboutUsContent, viewAboutContent } from "../about.controller.js";
import upload from "../../../utils/cloudinary_upload.js";

const aboutRoute = express.Router()

aboutRoute.post('/add', upload.fields(
    [
        { name: 'pc_image', maxCount: 1 },
        { name: 'mobile_image', maxCount: 1 }
    ]
), addAboutUsContent)

aboutRoute.get('/view', viewAboutContent)

export default aboutRoute