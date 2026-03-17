import express from 'express'
import { saveUserContact, viewUserContact } from '../contact.controller.js'
const contactRoute = express.Router()
contactRoute.post('/save', saveUserContact)
contactRoute.get('/view', viewUserContact)

export default contactRoute