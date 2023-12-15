import express from 'express';
import { createSubscription as createCanSub, getCandidateSub } from "../controller/subscription/candidateSub";
import { createSubscription as createEmpSub, getEmploySub } from "../controller/subscription/employerSub";

const subscriptionRouter = express.Router();
subscriptionRouter.route("/employer").post(createEmpSub).get(getEmploySub);
subscriptionRouter.route("/candidate").post(createCanSub).get(getCandidateSub);

export default subscriptionRouter;
