import mongoose, { Schema, Document } from 'mongoose';

interface IDiscountCoupon extends Document {
    code: string;
    discountPercentage: number;
    expirationDate: Date;
    isValid: boolean;
    description?: string;
}

const CouponSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountPercentage: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isValid: { type: Boolean, default: true },

}, { timestamps: true });

const DiscountCoupon = mongoose.model<IDiscountCoupon>('DiscountCoupon', CouponSchema);
// 
export default DiscountCoupon;