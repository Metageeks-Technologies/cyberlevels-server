import mongoose, { Schema } from 'mongoose';
import { IBlogPost } from '../../types/blog';

const blogSchema: Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    createdBy: {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    content: {
        type: String,
        required: true,
    },
    mainImage: {
        type: String,
    },
    category: [
        {
            type: String,
        }
    ],
    comments: [
        {
            userId: String,
            userAvatar: String,
            userName: String,
            text: String,
            timestamp: { type: Date, default: Date.now },
        }
    ]
}, { timestamps: true });

const Blog = mongoose.model<IBlogPost>('Blog', blogSchema);
export default Blog;