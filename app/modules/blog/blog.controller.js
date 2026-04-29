import { TypeOverrides } from "pg"
import pool from "../../config/pgDb.js"
import { addblogCategoryService, addSectionInBlogService, saveBlogService, updateBlogService, UpdateSectionInBlogService } from "./blog.service.js"

export const addBlogCategory = async (req, res) => {
    try {
        const { blogCategory } = req.body
        const checkExists = await pool.query('SELECT * FROM blog_category WHERE category_name = $1', [blogCategory])
        if (checkExists.rows.length > 0) return res.status(409).json({
            success: false,
            msg: 'Category Already Exist'
        })
        else {
            const result = await addblogCategoryService(blogCategory)
            console.log(result)
            res.status(200).json({
                success: true,
                msg: 'Category Added Successfully'
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const viewBlogCategory = async (req, res) => {
    try {
        const result = await pool.query(`
                SELECT * FROM blog_category  
            `)

        if (!result) return res.status(404).json({
            success: false,
            msg: 'No Blog Category found'
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'blog categories data',
                result: result.rows
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

export const addBlog = async (req, res) => {
    try {
        const result = await saveBlogService(req)
        if (!result) return res.status(409).json({
            success: false,
            msg: 'Slug Already Added Before'
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'Blog Added Successfully !'
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

export const viewBlogs = async (req, res) => {
    try {
        const result = await pool.query(`
                    SELECT 
                        b.*,
                        COALESCE(
                            json_agg(bs.*) FILTER (WHERE bs.id IS NOT NULL),
                            '[]'
                        ) AS sections
                    FROM blogs b
                    LEFT JOIN blog_sections bs
                        ON b.id = bs.blog_id

                        WHERE is_active = true
                    GROUP BY b.id
                    ORDER BY b.created_at DESC
                    
                `)

        const blogs = result.rows

        if (!blogs) return res.status(404).json({
            success: false,
            msg: 'Blogs Not Found'
        })
        else {
            return res.status(200).json({
                success: true,
                msg: 'All Blogs Data',
                blogs
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

export const addSectionInBlog = async (req, res) => {
    try {
        const result = await addSectionInBlogService(req)

        if (!result.success) {
            return res.status(400).json({
                success: false,
                msg: result.msg || 'Cannot add sections of blog in db'
            })
        }
        console.log(result)

        return res.status(200).json({
            success: true,
            msg: result.msg || 'Section Added Successfully'
        })

    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const getSectionsByBlogId = async (req, res) => {
    try {
        const { blog_id } = req.params

        const result = await pool.query(
            `SELECT * FROM blog_sections WHERE blog_id = $1 ORDER BY id ASC`,
            [blog_id]
        )

        return res.status(200).json({
            success: true,
            sections: result.rows
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false })
    }
}

export const UpdateSectionInBlog = async (req, res) => {
    try {
        const result = await UpdateSectionInBlogService(req)

        return res.status(result.status || 500).json({
            success: result.success,
            msg: result.msg
        })

    } catch (error) {
        console.log(error.message || 'Server Error')

        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params
        const response = await pool.query(`
                SELECT * FROM blogs WHERE id = $1    
            `, [id])
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'Blog Not Found'
            })
        }
        const result = response.rows[0]
        return res.status(200).json({
            success: true,
            msg: 'Blog Data By Id',
            result
        })
    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const updateBlog = async (req, res) => {
    try {
        const result = await updateBlogService(req)

        if (!result) {
            return res.status(404).json({
                success: false,
                msg: 'Blog Not Found'
            })
        }

        return res.status(200).json({
            success: true,
            msg: 'Blog Updated Successfully',
            result
        })

    } catch (error) {
        console.log(error.message || 'Server Error')

        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                msg: 'Slug already exists'
            })
        }

        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

export const fetchBlogByCategory = async (req, res) => {
    try {
        const { category_id } = req.params

        const result = await pool.query(`
            SELECT 
                *,
                TO_CHAR(
                    created_at AT TIME ZONE 'Asia/Kolkata',
                    'DD-MM-YYYY'
                ) AS date_only
            FROM blogs
            WHERE blog_category_id = $1 AND is_active = true
        `, [category_id])


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'Blogs Not Found In This Category'
            })
        }

        return res.status(200).json({
            success: true,
            msg: 'All Blogs Of This Category',
            blogs: result.rows
        })

    } catch (error) {
        console.log(error.message || 'Server Error')
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}


