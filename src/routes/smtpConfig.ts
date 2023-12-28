import express from 'express';
import { createSmtpConfig,getSmtpConfigs,updateSmtpConfig } from '../controller/smtpConfigController';

const smtpConfigRouter = express.Router();

// Create a new SMTP configuration
smtpConfigRouter.route("/").post(createSmtpConfig).get(getSmtpConfigs);
smtpConfigRouter.route("/").put(updateSmtpConfig);


export default smtpConfigRouter;