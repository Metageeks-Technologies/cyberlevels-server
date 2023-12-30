import express from 'express';
import { createJobApp, getAllAppByCandidate, getAllAppByJobPost, getAllJobAppByCandidate, getAllCandidateAppByJob, updateStatus, getAllShortlistedJobAppByCandidateId } from '../controller/jobAppController';
import { askFeedback, getFeedback, responseFeedback } from '../controller/feedback';
import { isAuthenticatedCandidate } from '../middleware/auth';
const jobAppRouter = express.Router();

jobAppRouter.route("/create").post(isAuthenticatedCandidate, createJobApp);
jobAppRouter.route("/candidate/:id").get(getAllAppByCandidate);
jobAppRouter.route("/jobPost/:id").get(getAllAppByJobPost);
jobAppRouter.route("/updateStatus").patch(updateStatus);
jobAppRouter.route("/candidateDash/:id/:page").get(isAuthenticatedCandidate, getAllJobAppByCandidate);
jobAppRouter.route('/employerDash/:id').get(getAllCandidateAppByJob);
jobAppRouter.route('/feedback/ask').post(isAuthenticatedCandidate, askFeedback);
jobAppRouter.route('/feedback/response').patch(responseFeedback);
jobAppRouter.route('/feedback/:id').get(getFeedback);
jobAppRouter.route('/getallshortlistedjobapp/:id').get(getAllShortlistedJobAppByCandidateId)




export default jobAppRouter;
