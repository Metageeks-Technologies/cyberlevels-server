import express from 'express';
// import {createTemplate,getAllTemplates,removeTemplate,updateTemplate} from '../controller/emailTemplateController';
import { createEmailTemplate,getEmailTemplates, updateEmailTemplate,removeEmailTemplate} from '../controller/emailTemplateController';


const emailTemplateRouter = express.Router();
// Create a new template
emailTemplateRouter.route("/").post(createEmailTemplate).get(getEmailTemplates)
emailTemplateRouter.route("/:id").patch(updateEmailTemplate).delete(removeEmailTemplate);
emailTemplateRouter.route("/updateuse/:id").patch()


export default emailTemplateRouter;