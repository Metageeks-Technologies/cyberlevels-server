import express from 'express';
import { createSubscription as createCanSub, getCandidateSub,updateSubscription as updateCanSub } from "../controller/subscription/candidateSub";
import { createSubscription as createEmpSub, getEmploySub, updateSubscription as updateEmpSub } from "../controller/subscription/employerSub";

const subscriptionRouter = express.Router();
subscriptionRouter.route("/employer").post(createEmpSub).get(getEmploySub).patch(updateEmpSub);
subscriptionRouter.route("/candidate").post(createCanSub).get(getCandidateSub).patch(updateCanSub);

export default subscriptionRouter;
