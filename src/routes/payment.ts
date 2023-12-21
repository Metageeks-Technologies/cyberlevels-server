import express from 'express';
import { checkout, getPayments, getRazorApiKey, paymentVerification } from '../controller/payment';

const paymentRouter = express.Router();
paymentRouter.route("/checkout").post(checkout);
paymentRouter.route("/getKey").get(getRazorApiKey);
paymentRouter.route("/paymentVerification").post(paymentVerification);
paymentRouter.route("/get").get(getPayments);






export default paymentRouter;
