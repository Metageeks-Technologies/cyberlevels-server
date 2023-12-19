import mongoose, { Schema } from 'mongoose';
import { IRazorpayPayment } from '../types/payment';

const paymentSchema: Schema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
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
        refPath: 'subscriptionPlan',
        required: true,
    },
    subscriptionPlan: {
        type: String,
        required: true,
        enum: ['CandidateSub', 'EmployerSub']
    },
    payment_method: {
        type: String,
    },
    receipt: {
        type: String,
    },

}, { timestamps: true });

const Payment = mongoose.model<IRazorpayPayment>('Payment', paymentSchema);
export default Payment