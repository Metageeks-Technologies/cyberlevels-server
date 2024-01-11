import mongoose, { Schema } from 'mongoose';
import { IRazorpayPayment } from '../types/payment';

const paymentSchema: Schema = new mongoose.Schema({
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
        required: true,
    },
    razorpaySignature: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel',
        required: true,
    },
    userModel: {
        type: String,
        required: true,
        enum: ['Candidate', 'Employer']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'productModel',
        required: true,
    },
    productModel: {
        type: String,
        required: true,
        enum: ['CandidateSub', 'EmployerSub']
    },
    payment_method: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
    },
    receipt: {
        type: String,
    },

}, { timestamps: true });

const Payment = mongoose.model<IRazorpayPayment>('Payment', paymentSchema);
export default Payment