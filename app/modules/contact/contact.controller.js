import pool from "../../config/pgDb.js"
import { saveContactService } from "./contact.service.js"

export const saveUserContact = async (req, res) => {
    try {
        const response = await saveContactService(req)
        if (!response) return res.status(404).json({
            success: false,
            msg: 'Cannot recieve your message'
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'Thank You For Contact Us'
            })
        }
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error',
            error
        })
    }
}

export const viewUserContact = async (req, res) => {
    try {
        const response = await pool.query(`
    SELECT 
        c.*,
        TO_CHAR(c.created_at AT TIME ZONE 'Asia/Kolkata', 'HH12:MI AM') AS time_only
    FROM contacts c
    ORDER BY c.created_at DESC
`)
        const contactsQueries = response.rows
        if (!contactsQueries) {
            return res.status(404).json({
                success: false,
                msg: 'Cannot found contacts'
            })
        }
        else {
            return res.status(200).json({
                success: true,
                msg: 'All Contact Queries',
                contactsQueries
            })
        }
    } catch (error) {
        console.log(error.message || 'Server Error')
        return
    }
}