import catchAsyncError from "../middleware/catchAsyncError";
import Blog from "../model/blog/BlogPost";
import ErrorHandler from "../utils/errorHandler";

export const createBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.create(req.body);
  if (!blog) {
    return next(new ErrorHandler("blog not created", 400));
  }
  res.status(200).json({
    success: true,
    blog,
  });
});

export const getBlogs = catchAsyncError(async (req, res, next) => {
  //   const { searchTerm } = req.query;
  //   let filter = {};
  const {page} = req.body;
  const p = Number(page)||1;
  const limit = 8;
  const skip = (p-1)*limit;
  const blogs = await Blog.find().skip(skip).limit(limit).sort({createdAt:-1});
  const totalBlogs = await Blog.countDocuments();
  const totalPages = totalBlogs/limit;

  if (!blogs || blogs.length === 0) {
    return next(new ErrorHandler("blogs not found", 404));
  }
  res.status(200).json({
    success: true,
    blogs,
    totalBlogs,
    totalPages,
    blogsPerPage:limit
  });
});

export const getBlogsBySearch = catchAsyncError(async (req, res, next) => {
  const { searchTerm } = req.query;
//   console.log(searchTerm, "Hello");
  let filter = {};
  if (searchTerm) {
    filter = {
      $or: [
        { title: { $regex: new RegExp(searchTerm.toString(), "i") } },
        { category: { $regex: new RegExp(searchTerm.toString(), "i") } },
      ],
    };
  }
  if (searchTerm === "") {
    return res.status(200).json({
      success: true,
      blogs: [],
    });
  }
  const blogs = await Blog.find(filter);
  if (!blogs || blogs.length === 0) {
    return next(new ErrorHandler("blogs not found", 404));
  }
  res.status(200).json({
    success: true,
    blogs,
  });
});

export const getBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("blogId not found", 400));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("blog not found", 404));
  }
  res.status(200).json({
    success: true,
    blog,
  });
});

export const updateBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("blogId not found", 400));
  }

  const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  if (!blog) {
    return next(new ErrorHandler("blog not found", 404));
  }
  res.status(200).json({
    success: true,
    blog,
  });
});

export const deleteBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("blogId not found", 400));
  }

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    return next(new ErrorHandler("blog not found", 404));
  }
  res.status(200).json({
    success: true,
    blog,
  });
});

export const addComment = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new ErrorHandler("blogId not found", 400));
  }

  const blog = await Blog.findOneAndUpdate(
    { _id: id },
    { $addToSet: { comments: req.body } },
    { new: true }
  );
  if (!blog) {
    return next(new ErrorHandler("blog not found", 404));
  }
  res.status(200).json({
    success: true,
    comment: blog.comments[blog.comments.length - 1],
  });
});

export const editComment = catchAsyncError(async (req, res, next) => {
  const { id, commentId } = req.params;

  if (!id) {
    return next(new ErrorHandler("blogId not found", 400));
  }

  const blog = await Blog.findOneAndUpdate(
    { _id: id, "comments._id": commentId },
    { $set: { "comments.$.text": req.body.text } },
    { new: true }
  );
  if (!blog) {
    return next(new ErrorHandler("blog not found", 404));
  }
  res.status(200).json({
    success: true,
    blog,
  });
});

export const deleteComment = catchAsyncError(async (req, res, next) => {
  const { id, commentId } = req.params;

  if (!id) {
    return next(new ErrorHandler("blogId not found", 400));
  }

  const blog = await Blog.findByIdAndUpdate(
    id,
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  );
  if (!blog) {
    return next(new ErrorHandler("blog not found", 404));
  }
  res.status(200).json({
    success: true,
    blog,
  });
});
