import pool from "../../config/pgDb.js"
import { createAppointmentService, deleteAppointmentByIdService } from "./appointment.service.js"

export const createAppointment = async (req, res) => {
    try {
        const response = await createAppointmentService(req)
        if (!response) return res.status(404).json({
            success: false,
            msg: 'cannot book appointment'
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'Appointment Booked Successfully !',
            })
        }
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const viewAppointments = async (req, res) => {
    try {
        const result = await pool.query(`
                SELECT 
                    apt.doctor_id,
                    apt.id,
                	apt.patient_name,
	                apt.patient_phone,
	                apt.patient_email,
	                d.profile_image,
	                d.name,
                    apt.payment_method,

                    TO_CHAR(
                    apt.created_at AT TIME ZONE 'Asia/Kolkata',
                    'DD-MM-YYYY'
                    ) AS date_only,

                    TO_CHAR(apt.created_at AT TIME ZONE 'Asia/Kolkata', 'HH12:MI AM') AS time_only,


	                apt.created_at,
	                apt.payment_proof_image

                    FROM appointments apt
                    LEFT JOIN doctors d
                    ON d.id = apt.doctor_id

                    ORDER BY created_at DESC
            `)

        const appointments = result.rows

        if (!appointments) return res.status(404).json({
            success: false,
            msg: 'Cannot found appointments'
        })

        else {
            return res.status(200).json({
                success: true,
                msg: 'All Appointments',
                appointments
            })
        }
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params
        const result = deleteAppointmentByIdService(id)
        if (!result) return res.status(404).json({
            success: false,
            msg: 'Cannot delete appointment'
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'Appointment deleted Successfully !'
            })
        }
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}