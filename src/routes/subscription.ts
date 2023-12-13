import express from 'express';
import { createSubscription as createCanSub } from "../controller/subscription/candidateSub";
import { createSubscription as createEmpSub } from "../controller/subscription/employerSub";

const subscriptionRouter = express.Router();
subscriptionRouter.route("/employer").post(createEmpSub);
subscriptionRouter.route("/candidate").post(createCanSub);

export default subscriptionRouter;
