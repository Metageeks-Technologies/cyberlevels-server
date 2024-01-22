import { Request, Response } from 'express';
import EmailTemplateModel from '../model/EmailTemplate';

export const createEmailTemplate = async (req: Request, res: Response) => {
  try {
    const {id, templateType,templateName, subject, body } = req.body;
    const template = new EmailTemplateModel({ id,templateType,templateName, subject, body });
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getEmailTemplates = async (_req: Request, res: Response) => {
  try {
    // const templates = await EmailTemplateModel.find();
    const { page } = _req.query;

    const queryObject: any = {};

    console.log(page)
    const p = Number(page) || 1;
    const limit = 15;
    const skip = (p - 1) * limit;

    const result = await EmailTemplateModel.find(queryObject).skip(skip).limit(limit);
    const totalTemplate = await EmailTemplateModel.countDocuments(queryObject);
    const totalNumOfPage = Math.ceil(totalTemplate / limit);

    res.status(200).json({
        success: true,
        totalNumOfPage,
        totalTemplate,
        result,
    });
    // res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removeEmailTemplate = async (req: Request, res: Response) => {
  try {
    const templateId = req.params.id;
    const removedTemplate = await EmailTemplateModel.findByIdAndDelete(templateId);
    res.status(200).json(removedTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateEmailTemplate = async (req:Request, res:Response) => {
    try {
        const templateId = req.body._id;
        const updateTemplate=await EmailTemplateModel.findByIdAndUpdate(templateId,req.body);
        res.status(200).json(updateTemplate);        
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

