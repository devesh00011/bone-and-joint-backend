import cloudinary from "../../config/cloudinary.js";
import pool from "../../config/pgDb.js";

export const addServiceService = async (req) => {
    try {
        const {
            service_name,
            service_slug,
            short_description,
            full_details,
            meta_title,
            meta_description
        } = req.body

        let service_image = null
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "services" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            service_image = result.secure_url;
        }

        const key_benefits = req.body.key_benefits
            ? JSON.parse(req.body.key_benefits)
            : [];

        const commonly_used = req.body.commonly_used
            ? JSON.parse(req.body.commonly_used)
            : [];

        const query = `
      INSERT INTO services (
            service_name,
            service_slug,
            short_description,
            full_details,
            meta_title,
            meta_description,
            key_benefits,
            commonly_used,
            service_image
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      RETURNING *;
    `;

        const values = [
            service_name,
            service_slug,
            short_description,
            full_details,
            meta_title,
            meta_description,
            key_benefits,
            commonly_used,
            service_image
        ]

        const response = await pool.query(query, values);
        return response.rows[0];


    } catch (error) {
        console.log(error)
    }
}

export const viewServiceByIdService = async (id) => {
    try {
        const result = await pool.query(`
            SELECT * from services 
            WHERE id = $1 
            `, [id])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}

export const updateServiceByIdService = async (req) => {
    try {
        const { id } = req.params
        const formDataObj = { ...req.body }

        const key_benefits = formDataObj.key_benefits
            ? JSON.parse(formDataObj.key_benefits)
            : [];

        const commonly_used = formDataObj.commonly_used
            ? JSON.parse(formDataObj.commonly_used)
            : [];

        let service_image = null;

        if (req.file) {

            // 1. Agar old image hai to destroy karo
            if (req.file.service_image) {
                const publicId = req.file.service_image
                    .split("/")
                    .slice(-1)[0]
                    .split(".")[0];

                await cloudinary.uploader.destroy(`services/${publicId}`);
            }

            // 2. Upload new image
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "doctors" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });


            // 🟢 3. Save new image URL
            service_image = uploadResult.secure_url;
        }

        const result = await pool.query(`
          UPDATE services
          SET 
          service_name = $1,
          service_slug = $2,
          short_description = $3,
          full_details = $4,
          service_image = $5,
          meta_title = $6,
          meta_description = $7,
          key_benefits = $8,
          commonly_used = $9,
          updated_at = NOW()
          WHERE id = $10
          RETURNING *
            `,
            [
                formDataObj.service_name,
                formDataObj.service_slug,
                formDataObj.short_description,
                formDataObj.full_details,
                service_image,
                formDataObj.meta_title,
                formDataObj.meta_description,
                key_benefits,
                commonly_used,
                id
            ]
        )

        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}

export const deleteServiceByIdService = async (id) => {
    try {
        const result = await pool.query(`
            DELETE FROM services 
            WHERE id = $1
        `, [id])

        return result;
    } catch (error) {
        console.log(error)
    }
}

export const createServiceVideos = async (req) => {
    try {
        const { service_id, service_video, service_testimonials } = req.body;

        const query = `
                        INSERT INTO service_videos (
                service_id,
                service_video,
                service_testimonials
            )
            VALUES ($1, $2, $3)
            ON CONFLICT (service_id)
            DO UPDATE SET
                service_video = EXCLUDED.service_video,
                service_testimonials = EXCLUDED.service_testimonials
            RETURNING *;
                    `;

        const values = [service_id, service_video, service_testimonials];

        const result = await pool.query(query, values);

        return result;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

export const UpdateServicesVideosService = async (req) => {
    try {
        const { service_id, service_video, service_testimonials } = req.body;

        const query = `
            UPDATE service_videos
            SET 
                service_video = $1,
                service_testimonials = $2
            WHERE service_id = $3
            RETURNING *;
        `;

        const values = [service_video, service_testimonials, service_id];

        const result = await pool.query(query, values);

        return result;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
};