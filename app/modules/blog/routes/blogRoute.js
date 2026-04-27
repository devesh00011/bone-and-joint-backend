import express from "express";
import { addBlog, addBlogCategory, viewBlogCategory, viewBlogs } from "../blog.controller.js";
import upload from "../../../utils/cloudinary_upload.js";

const blogRoute = express.Router()

blogRoute.post('/add-category', addBlogCategory)
blogRoute.get('/view-category', viewBlogCategory)
blogRoute.post('/add-blog', upload.single('blog_image'), addBlog)
blogRoute.get('/view-blog', viewBlogs)



export default blogRoute