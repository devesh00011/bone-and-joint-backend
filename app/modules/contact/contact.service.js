import pool from "../../config/pgDb.js"

export const saveContactService = async (req) => {
    try {
        const { full_name, email_id, phone_number, user_message } = req.body
        const result = await pool.query(
            `
            INSERT INTO contacts (
                full_name,
                email_id,
                phone_number,
                user_message
            )
                VALUES (
                    $1,$2,$3,$4
                )
            RETURNING *
        `, [
            full_name,
            email_id,
            phone_number,
            user_message
        ])
        return result.rows[0]
    } catch (error) {
        return console.log(error)
    }
}