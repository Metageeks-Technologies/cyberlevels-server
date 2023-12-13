// templateSchema.ts
import mongoose, { Document, Schema, SchemaType } from 'mongoose';

export interface ISchemaTemplate {
    name: string;
    properties: Record<string, any>;
}
const templateSchema = new Schema<ISchemaTemplate>({
    name: { type: String, required: true },
    properties: { type: Schema.Types.Mixed, required: true },
});

interface TemplateDocument extends ISchemaTemplate, Document { }

const TemplateModel = mongoose.model<TemplateDocument>('TemplateModel', templateSchema);

export default TemplateModel;
