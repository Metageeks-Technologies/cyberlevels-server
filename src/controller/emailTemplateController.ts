import { Request, Response } from "express";
import EmailTemplateModel from "../model/EmailTemplate";
import catchAsyncError from "../middleware/catchAsyncError";

export const createEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { id, templateType, templateName, subject, body } = req.body;
    const template = new EmailTemplateModel({
      id,
      templateType,
      templateName,
      subject,
      body,
    });
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmailTemplates = async (_req: Request, res: Response) => {
  try {
    // const templates = await EmailTemplateModel.find();
    const { page,templateType } = _req.query;

    const queryObject: any = {};

    console.log(page)
    const p = Number(page) || 1;
    const limit = 8;
    const skip = (p - 1) * limit;

    const result = await EmailTemplateModel.find({templateType}).skip(skip).limit(limit);
    const totalTemplate = await EmailTemplateModel.countDocuments({templateType});
    const totalNumOfPage = Math.ceil(totalTemplate / limit);

    res.status(200).json({
        success: true,
        totalNumOfPage,
        totalTemplate,
        result,
    });
    // res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeEmailTemplate = async (req: Request, res: Response) => {
  try {
    const templateId = req.params.id;
    const removedTemplate = await EmailTemplateModel.findByIdAndDelete(
      templateId
    );
    res.status(200).json(removedTemplate);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEmailTemplate = async (req: Request, res: Response) => {
  try {
    const templateId = req.params.id;
    const updateTemplate = await EmailTemplateModel.findByIdAndUpdate(
      templateId,
      req.body
    );
    res.status(200).json(updateTemplate);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBeingUsedFor = catchAsyncError(async (req, res) => {
  const templateId = req.params.id;
  const use = req.query.use;
  const findTemplate = await EmailTemplateModel.findById(templateId);
  const findTemplateAlreadyBeingUsed = await EmailTemplateModel.findOne({templateType:findTemplate?.templateType,
    beingUsedFor: use,
  });
  if (!findTemplate) {
    return res.status(400).json({ error: "Template not found" });
  }

  findTemplate.beingUsedFor = use?.toString();
  const updateTemplate = await findTemplate.save();
  if (findTemplateAlreadyBeingUsed) {
    findTemplateAlreadyBeingUsed.beingUsedFor = "";
    await findTemplateAlreadyBeingUsed.save();
  }

  res.status(200).json({ doc: updateTemplate });
});
