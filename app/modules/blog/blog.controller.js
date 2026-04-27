import { TypeOverrides } from "pg"
import pool from "../../config/pgDb.js"
import { addblogCategoryService, saveBlogService } from "./blog.service.js"

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
            msg: 'Cannot add blog to DB'
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
                SELECT * from blogs   
                ORDER BY created_at DESC
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