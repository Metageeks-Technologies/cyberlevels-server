import express from 'express';
import { addCompany, getCompanies, getDetails, populateJobPost, updateLogo } from '../controller/company';
import { chatWithAiUsingRest } from '../controller/aiController';

const companyRouter = express.Router();

companyRouter.route("/add").post(addCompany);
companyRouter.route("/get").get(getCompanies);
companyRouter.route('/draft').post(chatWithAiUsingRest)
companyRouter.route('/logo').patch(updateLogo)
companyRouter.route('/populate').post(populateJobPost)
companyRouter.route("/:id").get(getDetails)



export default companyRouter;
