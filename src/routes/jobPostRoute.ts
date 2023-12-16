import express from 'express';
import { addJobPost, getJobPosts, populateJobPost, getDetails, deleteJobPost, getJobPostsForEmployer, getRelatedJobs, getAllJobPost } from '../controller/jobPostController';
import multer from 'multer'
import { chatWithAiUsingRest, deleteFromPinecone, getSuggestion, newQueryToPc, newUploadToPc, query, queryToPinecone, uploadResumeToPinecone } from '../controller/aiController';
import { isAuthenticatedCandidate } from '../middleware/auth';

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

jobPostRouter.route("/add").post(addJobPost);
jobPostRouter.route("/getalljobposts").get(getAllJobPost);
jobPostRouter.route("/get").get(getJobPosts);
jobPostRouter.route("/populate").post(populateJobPost);
jobPostRouter.route("/askGpt").get(chatWithAiUsingRest);
jobPostRouter.route("/employer/:employerId").get(getJobPostsForEmployer);
jobPostRouter.route("/related").get(getRelatedJobs);
jobPostRouter.route("/uploadToPc").post(upload.single('pdfFile'), uploadResumeToPinecone);
jobPostRouter.route("/queryToPc").get(queryToPinecone);
jobPostRouter.route("/deleteFromPc").delete(deleteFromPinecone);
jobPostRouter.route("/query").get(query);
jobPostRouter.route("/newUpload").post(newUploadToPc);
jobPostRouter.route("/newQuery").get(newQueryToPc);
jobPostRouter.route("/suggestion").get(getSuggestion);
jobPostRouter.route("/:id").get(isAuthenticatedCandidate, getDetails).delete(deleteJobPost);

export default jobPostRouter;
