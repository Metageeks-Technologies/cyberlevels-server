import { Request, Response } from 'express';
import SmtpConfigModel from '../model/SmtpConfig';

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
      res.status(200).json(configs);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };