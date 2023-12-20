import Razorpay from "razorpay";
import ErrorHandler from "./errorHandler";
import dotenv from 'dotenv'
dotenv.config();

const key_id = process.env.RAZORPAY_API_KEY;
const key_secret = process.env.RAZORPAY_API_SECRET;

if (!key_id || !key_secret) {
    console.log(key_id, key_secret)
    throw new ErrorHandler('RAZORPAY_API_KEY and/or RAZORPAY_API_SECRET are missing.', 500);
}

export const razorpay = new Razorpay({
    key_id,
    key_secret
});