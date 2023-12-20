import express from 'express';
import { checkout, getRazorApiKey, paymentVerification } from '../controller/payment';

const paymentRouter = express.Router();
paymentRouter.route("/checkout").post(checkout);
paymentRouter.route("/getKey").get(getRazorApiKey);
paymentRouter.route("/paymentVerification").post(paymentVerification);




export default paymentRouter;
