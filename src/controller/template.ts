import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import TemplateModel from "../model/Template";

export const createTemplate = catchAsyncError(async (req, res, next) => {

    const dynamicTemplate = await TemplateModel.create(req.body);

    res.status(200).json({
        success: true,
        dynamicTemplate
    });

})

export const updateTemplate = catchAsyncError(async (req, res, next) => {


    const { label, type, modelName, required } = req.body;
    console.log(req.body);

    const template = await TemplateModel.findOne({ name: modelName });
    if (!template) {
        return next(new ErrorHandler("template not found", 404));
    }

    const newProperty = {
        [label]: {
            type,
            ...(required ? { required } : {}),
        },
    };

    template.properties.offering = {
        ...template.properties.offering,
        ...newProperty,
    };

    // const updatedTemplate = await template.save();
    await TemplateModel.updateOne(
        { name: modelName },
        { $set: { [`properties.offering.${label}`]: newProperty[label] } }
    );

    const updatedTemplate = await TemplateModel.findOne({ name: modelName });



    res.status(200).json({
        success: true,
        template: updatedTemplate
    });

})

export const getTemplate = catchAsyncError(async (req, res, next) => {

    const { model } = req.query
    const dynamicTemplate = await TemplateModel.findOne({ name: model });

    res.status(200).json({
        success: true,
        dynamicTemplate
    });
})