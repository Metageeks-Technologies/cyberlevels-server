import express from 'express';
import { addJobPost, getJobPosts, populateJobPost, getDetails, deleteJobPost, getJobPostsForEmployer, getRelatedJobs, getAllJobPost, getJobPostViews, addJobPostViews, getJobPostsForEmployerDashboard, getJobDetailsForEmployerChartNiceSelect, getJobDetailsForEmployerDashBoardCards, getJobPostByCreatedDate, updateJobPost, getDetailsForEmployer } from '../controller/jobPostController';
import multer from 'multer'
import { chatWithAiUsingRest, deleteFromPinecone, getSuggestion, newQueryToPc, newUploadToPc, query, queryToPinecone, uploadResumeToPinecone } from '../controller/aiController';
import { isAuthenticatedCandidate, isAuthenticatedEmployer } from '../middleware/auth';
import profileComplete from '../middleware/profileComplete';

const jobPostRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // The directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original filename
    },
});
const upload = multer({ storage: storage });

jobPostRouter.route("/add").post(addJobPost).patch(updateJobPost);
jobPostRouter.route("/getalljobposts").get(getAllJobPost);
jobPostRouter.route("/get").get(getJobPosts);
jobPostRouter.route("/populate").post(populateJobPost);
jobPostRouter.route("/askGpt").get(chatWithAiUsingRest);
jobPostRouter.route("/employer/:employerId").get(getJobPostsForEmployer);
jobPostRouter.route("/related").get(isAuthenticatedCandidate, getRelatedJobs);
jobPostRouter.route("/uploadToPc").post(upload.single('pdfFile'), uploadResumeToPinecone);
jobPostRouter.route("/queryToPc").get(queryToPinecone);
jobPostRouter.route("/deleteFromPc").delete(deleteFromPinecone);
jobPostRouter.route("/query").get(query);
jobPostRouter.route("/newUpload").post(newUploadToPc);
jobPostRouter.route("/newQuery").get(newQueryToPc);
jobPostRouter.route("/suggestion").get(getSuggestion);
jobPostRouter.route("/getJobForEmployer/:id").get(isAuthenticatedEmployer,  getDetailsForEmployer);
jobPostRouter.route("/:id").get(isAuthenticatedCandidate, profileComplete, getDetails).delete(deleteJobPost);
jobPostRouter.route("/jobpostviews/:id/:viewby").get(getJobPostViews);
jobPostRouter.route("/jobpostviews/:id/").post(addJobPostViews);
jobPostRouter.route("/jobpostforemployerdashboard/:id").get(getJobPostsForEmployerDashboard);
jobPostRouter.route("/jobpostforemployerniceselect/:id").get(getJobDetailsForEmployerChartNiceSelect);
jobPostRouter.route("/jobpostforemployerdashboardcards/:id").get(getJobDetailsForEmployerDashBoardCards);
jobPostRouter.get("/itemsbyjoiningdate/:viewby", getJobPostByCreatedDate);

export default jobPostRouter;
