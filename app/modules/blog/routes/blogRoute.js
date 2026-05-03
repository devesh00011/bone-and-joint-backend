import express from "express";
import { addBlog, addBlogCategory, addSectionInBlog, deleteBlogById, deleteCategoryById, fetchBlogByCategory, fetchBlogBySlug, getBlogById, getSectionsByBlogId, updateBlog, updateCategoryById, UpdateSectionInBlog, viewBlogCategory, viewBlogCategoryById, viewBlogs, viewBlogsActive } from "../blog.controller.js";
import upload from "../../../utils/cloudinary_upload.js";

const blogRoute = express.Router()

// blogs categories api
blogRoute.post('/add-category', addBlogCategory)
blogRoute.get('/view-category', viewBlogCategory)
blogRoute.get('/view-category/:id', viewBlogCategoryById)
blogRoute.post('/fetch-by-category/:category_id', fetchBlogByCategory)
blogRoute.post('/delete-category/:id', deleteCategoryById)
blogRoute.post('/update-category/:id', updateCategoryById)

// blogs api
blogRoute.post('/add-blog', upload.single('blog_image'), addBlog)
blogRoute.get('/view-blog-all', viewBlogs)
blogRoute.get('/view-blog-active', viewBlogsActive)
blogRoute.post('/delete/:id', deleteBlogById)

blogRoute.get('/view-blog/:id', getBlogById)
blogRoute.post('/update-blog/:id', upload.single('blog_image'), updateBlog)
blogRoute.post('/fetch-sections-by-slug', fetchBlogBySlug)


//blog sections api
blogRoute.post('/add-section', upload.any(), addSectionInBlog)
blogRoute.post('/update-section', upload.any(), UpdateSectionInBlog)
blogRoute.get('/sections/:blog_id', getSectionsByBlogId)

export default blogRoute