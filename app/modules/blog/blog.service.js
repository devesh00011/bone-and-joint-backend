import cloudinary from "../../config/cloudinary.js"
import pool from "../../config/pgDb.js"
import fs from "fs"
import path from "path"


export const addblogCategoryService = async (blogCategory) => {
    try {

        const response = await pool.query(`
                INSERT INTO  blog_category (category_name)
                VALUES ($1)
                RETURNING *
            `, [blogCategory])

        return response.rows[0]

    } catch (error) {
        console.log(error.message || 'Server Error')
    }
}

export const saveBlogService = async (req) => {
    try {
        const { blog_title, blog_slug, blog_full_description, blog_author_name, blog_read_time, blog_category_id, meta_title, meta_description } = req.body
        const formDataObj = { ...req.body }

        const is_active =
            formDataObj.is_active !== undefined
                ? formDataObj.is_active === "true" || formDataObj.is_active === true
                : true;

        let blog_image = null;


        // 1. Upload image
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blogs" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        // 2. Save image URL
        blog_image = uploadResult.secure_url;

        const query = `
                INSERT INTO blogs (
                    blog_title,
                    blog_slug,
                    blog_full_description,
                    blog_image,
                    blog_author_name,
                    blog_read_time,
                    blog_category_id,
                    is_active,
                    meta_title,
                    meta_description
                ) 
                VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
                )
                RETURNING *;
            `

        const values = [
            blog_title,
            blog_slug,
            blog_full_description,
            blog_image,
            blog_author_name,
            blog_read_time,
            blog_category_id,
            is_active,
            meta_title,
            meta_description
        ]

        const result = await pool.query(query, values);
        return result.rows[0];

    } catch (error) {
        console.log(error.message || 'Server Error')
    }
}

export const addSectionInBlogService = async (req) => {
    try {
        const { blog_id, sections } = req.body

        if (!blog_id || !sections) {
            return {
                success: false,
                msg: 'Missing required fields'
            }
        }

        const parsedSections = JSON.parse(sections)

        for (let sec of parsedSections) {

            let imagePath = null

            if (sec.image_key) {
                const file = req.files.find(f => f.fieldname === sec.image_key)

                if (file) {
                    const uploadResult = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "blog_sections" },
                            (error, result) => {
                                if (error) reject(error)
                                else resolve(result)
                            }
                        )

                        stream.end(file.buffer) // 🔥 IMPORTANT
                    })

                    imagePath = uploadResult.secure_url
                }
            }

            await pool.query(
                `INSERT INTO blog_sections 
                (blog_id, section_title, section_short_description, section_full_description, section_image, sub_content)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    blog_id,
                    sec.section_title,
                    sec.section_short_description,
                    sec.section_full_description,
                    imagePath,
                    JSON.stringify(sec.subItems)
                ]
            )
        }

        // ✅ return AFTER loop
        return {
            success: true,
            msg: 'All sections added successfully'
        }

    } catch (error) {
        console.log(error.message || 'Server Error')

        return {
            success: false,
            msg: 'Server Error'
        }
    }
}

export const UpdateSectionInBlogService = async (req) => {
    try {
        const { blog_id, sections } = req.body

        if (!blog_id) {
            return {
                status: 400,
                success: false,
                msg: "Blog ID is required"
            }
        }

        const parsedSections = JSON.parse(sections)

        // existing data (for fallback + delete old images if needed)
        const existing = await pool.query(
            `SELECT * FROM blog_sections WHERE blog_id = $1`,
            [blog_id]
        )

        const existingData = existing.rows

        // delete old rows (replace strategy)
        await pool.query(
            `DELETE FROM blog_sections WHERE blog_id = $1`,
            [blog_id]
        )

        for (let i = 0; i < parsedSections.length; i++) {
            const sec = parsedSections[i]

            let imagePath = null

            // -----------------------------
            // FIND FILE (safe for upload.any / upload.fields both)
            // -----------------------------
            const file =
                Array.isArray(req.files)
                    ? req.files.find(f => f.fieldname === `section_image_${i}`)
                    : req.files?.[`section_image_${i}`]?.[0]

            // -----------------------------
            // NEW IMAGE UPLOAD (CLOUDINARY)
            // -----------------------------
            if (file) {
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "blog_sections" },
                        (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        }
                    )

                    stream.end(file.buffer)
                })

                imagePath = uploadResult.secure_url

                // OPTIONAL: delete old cloud image
                const oldImage = existingData[i]?.section_image
                if (oldImage && oldImage.includes("cloudinary")) {
                    const publicId = oldImage.split("/").pop().split(".")[0]

                    try {
                        await cloudinary.uploader.destroy(`blog_sections/${publicId}`)
                    } catch (err) {
                        console.log("Old image delete error:", err.message)
                    }
                }
            }

            // -----------------------------
            // KEEP OLD IMAGE IF NO NEW UPLOAD
            // -----------------------------
            else {
                imagePath = existingData[i]?.section_image || null
            }

            // -----------------------------
            // INSERT UPDATED SECTION
            // -----------------------------
            await pool.query(
                `
                INSERT INTO blog_sections 
                (
                    blog_id,
                    section_title,
                    section_short_description,
                    section_full_description,
                    section_image,
                    sub_content
                )
                VALUES ($1,$2,$3,$4,$5,$6)
                `,
                [
                    blog_id,
                    sec.section_title,
                    sec.section_short_description,
                    sec.section_full_description,
                    imagePath,
                    JSON.stringify(sec.subItems || [])
                ]
            )
        }

        return {
            status: 200,
            success: true,
            msg: "Blog sections updated successfully"
        }

    } catch (error) {
        console.log(error.message)

        return {
            status: 500,
            success: false,
            msg: "Server Error"
        }
    }
}

export const updateBlogService = async (req) => {
    try {
        const {
            blog_title,
            blog_slug,
            blog_full_description,
            blog_author_name,
            blog_read_time,
            blog_category_id,
            meta_title,
            meta_description,
            is_active
        } = req.body;

        const { id } = req.params;

        // 🔹 1. Get old blog
        const oldBlogRes = await pool.query(
            `SELECT blog_image FROM blogs WHERE id = $1`,
            [id]
        );

        const oldBlog = oldBlogRes.rows[0];
        if (oldBlogRes.rows.length === 0) {
            return null;
        }



        let blog_image = null;

        // 🔹 2. If new image comes
        if (req.file) {

            // 👉 delete old image
            if (oldBlog?.blog_image) {
                try {
                    const parts = oldBlog.blog_image.split('/');
                    const uploadIndex = parts.indexOf('upload');
                    const publicIdWithVersion = parts.slice(uploadIndex + 2).join('/');
                    const public_id = publicIdWithVersion.replace(/\.[^/.]+$/, "");
                    console.log("Deleting:", public_id);
                    await cloudinary.uploader.destroy(public_id);

                } catch (err) {
                    console.log("Cloudinary delete failed:", err.message);
                }
            }

            // 👉 upload new image
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "blogs" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            blog_image = uploadResult.secure_url;
        }

        const query = `
            UPDATE blogs SET
                blog_title = $1,
                blog_slug = $2,
                blog_full_description = $3,
                blog_image = COALESCE($4, blog_image),
                blog_author_name = $5,
                blog_read_time = $6,
                blog_category_id = $7,
                is_active = $8,
                meta_title = $9,
                meta_description = $10
            WHERE id = $11
            RETURNING *;
        `;

        const values = [
            blog_title,
            blog_slug,
            blog_full_description,
            blog_image,
            blog_author_name,
            blog_read_time,
            blog_category_id,
            is_active === "true" || is_active === true,
            meta_title,
            meta_description,
            id
        ];

        const result = await pool.query(query, values);

        return result.rows[0];

    } catch (error) {
        console.log(error.message || 'Server Error');
        throw error;
    }
};

