import express from 'express';
import { createSmtpConfig,getSmtpConfigs } from '../controller/smtpConfigController';

const smtpConfigRouter = express.Router();

// Create a new SMTP configuration
smtpConfigRouter.route("/").post(createSmtpConfig).get(getSmtpConfigs);


export default smtpConfigRouter;