import express from 'express';
import { createTemplate, getTemplate, updateTemplate } from '../controller/template';

const templateRouter = express.Router();
templateRouter.route("/create").post(createTemplate);
templateRouter.route("/update").post(updateTemplate);
templateRouter.route("/get").get(getTemplate);


export default templateRouter;
