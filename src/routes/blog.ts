import express from "express";
import {
  createBlog,
  getBlog,
  getBlogs,
  addComment,
  deleteComment,
  editComment,
  updateBlog,
  deleteBlog,
  getBlogsBySearch,
} from "../controller/blogController";

const blogRouter = express.Router();

blogRouter.route("/").post(createBlog).get(getBlogs);

blogRouter.route("/search").get(getBlogsBySearch);
blogRouter.route("/:id").get(getBlog).patch(updateBlog).delete(deleteBlog);

blogRouter.route("/comment").put(addComment);
blogRouter.route("/comment/edit").patch(editComment);
blogRouter.route("/comment/delete").patch(deleteComment);

export default blogRouter;
