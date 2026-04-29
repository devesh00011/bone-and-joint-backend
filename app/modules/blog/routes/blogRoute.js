import express from "express";
import { addBlog, addBlogCategory, addSectionInBlog, fetchBlogByCategory, getBlogById, getSectionsByBlogId, updateBlog, UpdateSectionInBlog, viewBlogCategory, viewBlogs } from "../blog.controller.js";
import upload from "../../../utils/cloudinary_upload.js";

const blogRoute = express.Router()

// blogs categories api
blogRoute.post('/add-category', addBlogCategory)
blogRoute.get('/view-category', viewBlogCategory)
blogRoute.post('/fetch-by-category/:category_id', fetchBlogByCategory)

// blogs api
blogRoute.post('/add-blog', upload.single('blog_image'), addBlog)
blogRoute.get('/view-blog', viewBlogs)
blogRoute.get('/view-blog/:id', getBlogById)
blogRoute.post('/update-blog/:id', upload.single('blog_image'), updateBlog)



//blog sections api
blogRoute.post('/add-section', upload.any(), addSectionInBlog)
blogRoute.post('/update-section', upload.any(), UpdateSectionInBlog)
blogRoute.get('/sections/:blog_id', getSectionsByBlogId)

export default blogRoute