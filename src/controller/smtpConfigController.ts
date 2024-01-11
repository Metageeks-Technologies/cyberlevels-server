import { Request, Response } from 'express';
import SmtpConfigModel from '../model/SmtpConfig';
import catchAsyncError from '../middleware/catchAsyncError';

export const createSmtpConfig = async (req: Request, res: Response) => {
  try {
    const { host, port, secure, user, pass } = req.body;
    const smtpConfig = new SmtpConfigModel({ host, port, secure, user, pass });
    const savedConfig = await smtpConfig.save();
    
    res.status(201).json(savedConfig);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSmtpConfigs = async (_req: Request, res: Response) => {
    try {
      const configs = await SmtpConfigModel.find();
      // if (configs.length === 0) {
      //   return res.status(404).json({ error: 'SMTP Configuration not found' });
      // }
      // const smtpConfig = configs[0];
      res.status(200).json(smtpConfig);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const updateSmtpConfig = catchAsyncError(async (req,res) => {
  const config = req.body;
  const newCongif = await SmtpConfigModel.findOneAndUpdate({},config);
  res.status(200).json(newCongif);

})