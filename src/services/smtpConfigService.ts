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