import EmailTemplateModel from '../model/EmailTemplate';
import SmtpConfigModel, { SmtpConfig } from '../model/SmtpConfig';

export const getSmtpConfigFromDB = async (): Promise< SmtpConfig | null> => {
  try {
    const smtpConfig = await SmtpConfigModel.findOne();
    return smtpConfig;
  } catch (error) {
    console.error('Error fetching SMTP configuration from the database:', error);
    return null;
  }
};

export const getEmailTemplate = async(templateFor:string,use:string) => {
  try{
    const template = EmailTemplateModel.findOne({templateType:templateFor,beingUsedFor:use});
    return template;
  }catch(err){
    console.error('Error fetching SMTP configuration from the database:', err);
    return null;
  }
}