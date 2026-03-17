import { Router } from "express";
import doctorRoute from "./doctor/routes/doctorRoute.js";
import appointmentRoute from "./appointment/routes/appointmentRoute.js";
import serviceRoute from "./service/routes/serviceRoute.js";
import adminRoute from "./admin/routes/adminRoute.js";
import contactRoute from "./contact/routes/contactRoute.js";
const indexRouter = Router()
indexRouter.use('/doctor', doctorRoute)
indexRouter.use('/appointment', appointmentRoute)
indexRouter.use('/service', serviceRoute)
indexRouter.use('/admin', adminRoute)
indexRouter.use('/contact', contactRoute)


export default indexRouter