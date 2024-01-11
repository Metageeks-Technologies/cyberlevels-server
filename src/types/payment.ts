import mongoose, { Document } from "mongoose";

export interface IRazorpayPayment extends Document {
    razorpay_order_id: {
        type: string;
        required: true;
    };
    razorpay_payment_id: {
        type: string;
        required: true;
    };
    razorpay_signature: {
        type: string;
        required: true;
    };
    user: {
        type: mongoose.Types.ObjectId;
        refPath: 'userModel';
        required: true;
    };
    userModel: {
        type: string;
        required: true;
        enum: ['Candidate', 'Employer'];
    };
    product: {
        type: mongoose.Types.ObjectId;
        refPath: 'subscriptionPlan';
        required: true;
    };
    subscriptionPlan: {
        type: string;
        required: true;
        enum: ['CandidateSub', 'EmployerSub'];
    };
    payment_method?: {
        type: string;
    };
    receipt?: {
        type: string;
    };
}
