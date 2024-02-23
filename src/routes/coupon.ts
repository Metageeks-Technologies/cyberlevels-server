import express from 'express';
import { createCoupon, editCoupon, getAllCoupons, getCoupon } from '../controller/couponController';
const couponRouter = express.Router();

couponRouter.route("/create").post(createCoupon);
couponRouter.route("/edit/:id").put(editCoupon);
couponRouter.route("/get/:id").get(getCoupon);
couponRouter.route("/getAll").get(getAllCoupons);

export default couponRouter;






