import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import TemplateModel from '../Template';
import type { IEmployerSub } from '../../types/subscription';
import type { ISchemaTemplate } from '../Template';

const getTemplateData = async (): Promise<ISchemaTemplate | null> => {
    try {
        return await TemplateModel.findOne({ name: 'EmployerSubModel' });

    } catch (error) {
        console.error('Error retrieving template:', error);
        return null;
    }
};

// Async function to initialize dynamic schema and model
const initializeDynamicModel = async () => {
    const templateData = await getTemplateData();

    if (!templateData) {
        throw new Error('Employer subscription Schema not found');
    }

    const employerSub = new Schema<IEmployerSub>(templateData.properties);

    return mongoose.model<IEmployerSub>('EmployerSub', employerSub);
};


// Export a Promise that resolves to the DynamicModel
export default initializeDynamicModel();
