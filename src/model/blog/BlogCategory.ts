import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICategory extends Document {
    name: string;
}

const category: Schema<ICategory> = new Schema({
    name: { type: String, required: true },
});

const BlogCategory = mongoose.model<ICategory>('BlogCategory', category);

export default BlogCategory;

