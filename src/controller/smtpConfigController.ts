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
      if (configs.length === 0) {
        return res.status(404).json({ error: 'SMTP Configuration not found' });
      }
      const smtpConfig = configs[0];
      res.status(200).json(smtpConfig);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// export const getSmtpConfigs= async (req: Request, res: Response)=>{
//   res.json(smtpConfig);
// }

export const updateSmtpConfig = async (req: Request, res: Response) => {
  try {
    const { host, port, secure, user, pass } = req.body;

    // Find the configuration based on host
    const existingConfig = await SmtpConfigModel.findOne({ host });

    if (!existingConfig) {
      return res.status(404).json({ error: 'SMTP Configuration not found' });
    }

    // Update the existing configuration with the new values
    existingConfig.port = port;
    existingConfig.secure = secure;
    existingConfig.user = user;
    existingConfig.pass = pass;

    const updatedConfig = await existingConfig.save();

    res.status(200).json(updatedConfig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};