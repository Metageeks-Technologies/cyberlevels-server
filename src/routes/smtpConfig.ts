import express from 'express';
import { createSmtpConfig,getSmtpConfigs, updateSmtpConfig } from '../controller/smtpConfigController';

const smtpConfigRouter = express.Router();

// Create a new SMTP configuration
smtpConfigRouter.route("/").post(createSmtpConfig).get(getSmtpConfigs).patch(updateSmtpConfig);


export default smtpConfigRouter;