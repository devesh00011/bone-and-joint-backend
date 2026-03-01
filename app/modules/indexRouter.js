import { Router } from "express";
import doctorRoute from "./doctor/routes/doctorRoute.js";
const indexRouter = Router()
indexRouter.use('/doctor', doctorRoute)
export default indexRouter