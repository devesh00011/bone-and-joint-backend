import pool from "../../config/pgDb.js";
import cloudinary from "../../config/cloudinary.js";

export const addAboutUsContent = async (req, res) => {
    try {
        const { description } = req.body;

        // ---------------------------
        // SAFE POINTS PARSING (NO JSON ERROR)
        // ---------------------------
        let parsedPoints = [];

        try {
            if (req.body.points) {
                if (typeof req.body.points === "string") {
                    parsedPoints = JSON.parse(req.body.points);
                } else if (Array.isArray(req.body.points)) {
                    parsedPoints = req.body.points;
                } else {
                    parsedPoints = [];
                }
            }
        } catch (err) {
            parsedPoints = [];
        }

        // Ensure always valid array
        if (!Array.isArray(parsedPoints)) {
            parsedPoints = [];
        }

        // ---------------------------
        // CHECK EXISTING ROW (SINGLE CMS ROW)
        // ---------------------------
        const existing = await pool.query(`SELECT * FROM about_us LIMIT 1`);
        const existingData = existing.rows[0];

        let pc_image = existingData?.pc_image || null;
        let mobile_image = existingData?.mobile_image || null;

        // ---------------------------
        // UPLOAD PC IMAGE
        // ---------------------------
        if (req.files?.pc_image?.[0]) {
            const uploadPc = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "about_us" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.files.pc_image[0].buffer);
            });

            pc_image = uploadPc.secure_url;
        }

        // ---------------------------
        // UPLOAD MOBILE IMAGE
        // ---------------------------
        if (req.files?.mobile_image?.[0]) {
            const uploadMobile = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "about_us" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.files.mobile_image[0].buffer);
            });

            mobile_image = uploadMobile.secure_url;
        }

        // ---------------------------
        // IF EXISTS → UPDATE
        // ---------------------------
        if (existingData) {
            const result = await pool.query(
                `
        UPDATE about_us
        SET 
          pc_image = $1,
          mobile_image = $2,
          description = $3,
          points = $4::jsonb,
          updated_at = NOW()
        WHERE id = $5
        RETURNING *
        `,
                [
                    pc_image,
                    mobile_image,
                    description,
                    JSON.stringify(parsedPoints),
                    existingData.id
                ]
            );

            return res.status(200).json({
                success: true,
                msg: "About Us updated successfully",
                data: result.rows[0],
            });
        }

        // ---------------------------
        // ELSE → INSERT FIRST TIME
        // ---------------------------
        const insertResult = await pool.query(
            `
      INSERT INTO about_us
      (pc_image, mobile_image, description, points, created_at, updated_at)
      VALUES ($1, $2, $3, $4::jsonb, NOW(), NOW())
      RETURNING *
      `,
            [
                pc_image,
                mobile_image,
                description,
                JSON.stringify(parsedPoints)
            ]
        );

        return res.status(200).json({
            success: true,
            msg: "About Us created successfully",
            data: insertResult.rows[0],
        });

    } catch (error) {
        console.log("ABOUT US ERROR:", error);

        return res.status(500).json({
            success: false,
            msg: "Server Error",
        });
    }
};

export const viewAboutContent = async (req, res) => {
    try {
        const result = await pool.query(`
                SELECT * from about_us  
            `)

        if (result.rows.length == 0) {
            return res.status(404).json({
                success: false,
                msg: 'Cannot Found Content'
            })
        }
        else {
            return res.status(200).json({
                success: true,
                msg: 'About Us Content',
                data: result.rows[0]
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