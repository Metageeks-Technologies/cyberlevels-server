import express from 'express';
import { isAuthenticatedCandidate } from '../../middleware/auth';
import { getAllEmployer, signupEmployer, loginEmployer, getCurrEmployer, addNotificationToCandidate, saveCandidate, getSavedCandidate, removeSavedCandidate, updateCurrEmployer, updateProfileAvatar, getEmployerByJoiningDate } from '../../controller/userController/employer';
import { uploadProfileToS3 } from '../../controller/userController/candidate';

const employerRouter = express.Router();

employerRouter.post('/auth/signup', signupEmployer)
employerRouter.post('/auth/login', loginEmployer)
employerRouter.get('/auth/:id', getCurrEmployer)
employerRouter.patch('/update/:id', updateCurrEmployer)
employerRouter.get("/getAllEmployers", isAuthenticatedCandidate, getAllEmployer)
employerRouter.patch("/candidateNotification", addNotificationToCandidate)
employerRouter.route("/uploadProfile").post(uploadProfileToS3).patch(updateProfileAvatar)
// save
employerRouter.route("/savedCandidate").post(saveCandidate).get(getSavedCandidate).delete(removeSavedCandidate)
employerRouter.get("/itemsbyjoiningdate/:viewby",getEmployerByJoiningDate);

export default employerRouter;