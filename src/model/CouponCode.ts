import mongoose, { Schema, Document } from 'mongoose';

interface IDiscountCoupon extends Document {
    code: string;
    discountPercentage: number;
    expirationDate: Date;
    isValid: boolean;
    maxUseLimit: number;
    usedCount: number;
    usedBy: string[];
    description?: string;
    userModel: "Employer" | "Candidate"
}

const CouponSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountPercentage: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isValid: { type: Boolean, default: true },
    maxUseLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    usedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'userModel',
        }
    ],
    userModel: {
        type: String,
        enum: ['Candidate', 'Employer']
    },


}, { timestamps: true });

const DiscountCoupon = mongoose.model<IDiscountCoupon>('DiscountCoupon', CouponSchema);
// 
export default DiscountCoupon;