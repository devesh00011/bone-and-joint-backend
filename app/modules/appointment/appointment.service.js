import cloudinary from "../../config/cloudinary.js";
import pool from "../../config/pgDb.js";

export const createAppointmentService = async (req) => {

    try {
        const {
            doctor_id,
            appointment_day,
            patient_name,
            patient_phone,
            patient_email,
            payment_method,

        } = req.body;

        let payment_proof_image = null

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'appointments' },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )
                stream.end(req.file.buffer)
            })
            payment_proof_image = result.secure_url
        }


        const query = `
                INSERT INTO appointments (
                    doctor_id,
                    appointment_day,
                    patient_name,
                    patient_phone,

                    patient_email,
                    payment_method,
                    payment_proof_image
                    )
                    VALUES (
                        $1,$2,$3,$4,$5,$6,$7  
                    )
                        RETURNING *;
            `;

        const values = [
            doctor_id.toString(),
            appointment_day,
            patient_name,
            patient_phone,
            patient_email,
            payment_method,
            payment_proof_image,
        ]

        const result = await pool.query(query, values)

        return result.rows[0]

    } catch (error) {
        console.log(error);
    }
};

export const deleteAppointmentByIdService = async (id) => {
    try {
        const response = await pool.query(`
                DELETE FROM appointments
                WHERE id = $1
            `, [id])

        return response;
    } catch (error) {
        console.log(error)
    }
}
