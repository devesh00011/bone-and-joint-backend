import cloudinary from "../../config/cloudinary.js"
import pool from "../../config/pgDb.js"

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