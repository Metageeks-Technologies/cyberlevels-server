// your nodemailer setup file
import nodemailer from "nodemailer";
import {
  getEmailTemplate,
  getSmtpConfigFromDB,
} from "../services/smtpConfigService";

export const sendMail = async function sendMail(
  user: string,
  useFor: string,
  data: any
): Promise<void> {
  try {
    const smtpConfig = await getSmtpConfigFromDB();
    // console.log(smtpConfig);
    if (smtpConfig) {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port),
        secure: smtpConfig.secure,
        auth: {
          user: smtpConfig.user!,
          pass: smtpConfig.pass!,
        },
      });

      const template = await getEmailTemplate(user, useFor);

      let Osubject: string | undefined = template?.subject,
        Ohtml: string | undefined = template?.body;

      const updatedHtml = String(Ohtml)
        .replace("{{email}}", data.email)
        .replace(
          "{{userAvatar}}",
          `<img class="CToWUd" src="${data.avatar}" alt="" width="20" height="20" data-bit="iit">`
        )
        .replace("{{Username}}", `${data.firstName} ${data.lastName}`)
        .replace("{{jobPost}}", `${data.title}`)
        .replace(`{{jobCode}}`, `${data.jobCode}`);

      //   if (str === 'candidateSignup') {
      //     Osubject = `Thank you for signing up ${data.firstName}`;
      //     Ohtml = `
      //   <h1>Welcome to Cyber Levels</h1>
      //   Hope you have a good time getting recruited!
      //   <br/>
      //   Here are your details-
      //   <br/>
      //   Name - ${data.firstName} - ${data.lastName}
      //   <br/>
      //   Email- ${data.email}
      //   `;
      //   } else if (str === 'employerSignup') {
      //     Osubject = `Thankyou for signing up ${data.firstName}`;
      //     Ohtml = `
      //   <h1>Welcome to Cyber Levels</h1>
      //   you will have a good time recruiting!!!
      //   <br/>
      //   your details:
      //   Email- ${data.email}
      //   `;
      //   } else if (str === 'login') {
      //     Osubject = `Important!!!`
      //     Ohtml = `
      //       <h1>Urgent Attention Required</h1>
      //       <br/>
      //       Someone has logged in to your Cyber Levels account if it was not you please change your password ASAP!!!.
      //   `
      //   } else if (str === 'candidateSignupEmail') {
      //     Osubject = `Thank you for signing up ${data.name}`
      //     Ohtml = `<h1>Welcome to Cyber Levels</h1>
      //   Hope you have a good time getting recruited!
      //   <br/>
      //   Here are your details-
      //   <br/>
      //   Name - ${data.name}
      //   <br/>
      //   Email- ${data.email}`
      //   } else if (str === `employerSignupEmail`) {
      //     Osubject = `Thank you for signing up ${data.name}`
      //     Ohtml = `<h1>Welcome to Cyber Levels</h1>
      //   you will have a good time recruiting!!!
      //   <br/>
      //   your details:
      //   Email- ${data.email}`
      //   } else if (str === `paymentSuccess`) {
      //     Osubject = `Dear ${data.userName} ,You have successfully purchased the ${data.productName} plan`
      //     Ohtml = `<h1>You have purchased our plan ${data.productName} of amount ${data.amount} </h1>
      // Hope we provide you with the best services!!!
      // <br/>
      // your details:
      // Email- ${data.email}`
      //   }

      let info = await transporter.sendMail({
        from: '"Rituj Manware 🆒" <manwarerutuj@gmail.com>', // sender address <${userObj.email}>
        to: data.email, // list of receivers
        subject: Osubject, // Subject line
        html: updatedHtml, // html body
      });

      console.log("Message sent: %s", info.messageId);

      // ... rest of your nodemailer logic
    } else {
      console.error("SMTP configuration not found in the database.");
    }
  } catch (error) {
    console.error("Error creating nodemailer transporter:", error);
  }
};

export const sendMailForFavAlert = async function sendMail(
  user: string,
  useFor: string,
  data: any
): Promise<void> {
  let smtpConfig;
  try {
    smtpConfig = await getSmtpConfigFromDB();
  } catch (error) {
    console.error("Error creating nodemailer transporter:", error);
  }
  if (!smtpConfig) {
    return;
  }
  let transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: parseInt(smtpConfig.port),
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user!,
      pass: smtpConfig.pass!,
    },
  });

  let subject: string = "";
  let html: string = "";

  if (useFor === "favCompanyJobSubmission") {
    subject = `New Job Submission for Favorite Company`;
    html = `
      <h1>New Job Submission for Favorite Company</h1>
      <br/>
      A new job submission has been made for your favorite company.
      <br/>
      Company: ${data.companyName}
      <br/>
      Job Title: ${data.jobTitle}
      <br/>
      Job Description: ${data.jobDescription}
    `;
  }
  try{
    let info = await transporter.sendMail({
      from: '"Rituj Manware 🆒" <manwarerutuj@gmail.com>',
      to: user,
      subject: subject,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);

  }catch(err){
    console.log(err);
  }
};

export const sendMailWeeklyNewsletter = async function sendMail(
  user: string,
  useFor: string,
  email: string,
  data:any,
): Promise<void> {
  let smtpConfig;
  try {
    smtpConfig = await getSmtpConfigFromDB();
  } catch (error) {
    console.error("Error creating nodemailer transporter:", error);
  }
  if (!smtpConfig) {
    return;
  }
  let transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: parseInt(smtpConfig.port),
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user!,
      pass: smtpConfig.pass!,
    },
  });

  const template = await getEmailTemplate(user, useFor);

  let Osubject: string | undefined = template?.subject,
    Ohtml: string | undefined = template?.body;

  
try{

  let info = await transporter.sendMail({
    from: '"Rituj Manware 🆒" <manwarerutuj@gmail.com>',
    to: email,
    subject: Osubject,
    html: Ohtml,
  });

  console.log("Message sent: %s", info.messageId);
}catch(error){
  console.log(error);
}
};

// import nodemailer from 'nodemailer';
// import { EmailData } from './types'; // Replace with the correct path to your types file
// import nodemailer from 'nodemailer';
// import { getSmtpConfigFromDB } from '../services/smtpConfigService';

// export const sendMail = async function sendMail(str: string, data: any): Promise<void> {
// let smtpConfig
// try {
//      smtpConfig = await getSmtpConfigFromDB();
//   }catch (error) {
//     console.error('Error creating nodemailer transporter:', error);
//   }
//   let transporter = nodemailer.createTransport({
//       host: smtpConfig.host,
//       port: smtpConfig.port,
//       secure: smtpConfig.secure,
//     auth: {
//       user: process.env.NODEMAILER_EMAIL!,
//       pass: process.env.NOMEMAILER_PASSWORD!,
//     },
//   });

//   let Osubject: string = '', Ohtml: string = '';

//   if (str === 'candidateSignup') {
//     Osubject = `Thank you for signing up ${data.firstName}`;
//     Ohtml = `
//     <h1>Welcome to Cyber Levels</h1>
//     Hope you have a good time getting recruited!
//     <br/>
//     Here are your details-
//     <br/>
//     Name - ${data.firstName} - ${data.lastName}
//     <br/>
//     Email- ${data.email}
//     `;
//   } else if (str === 'employerSignup') {
//     Osubject = `Thankyou for signing up ${data.firstName}`;
//     Ohtml = `
//     <h1>Welcome to Cyber Levels</h1>
//     you will have a good time recruiting!!!
//     <br/>
//     your details:
//     Email- ${data.email}
//     `;
//   } else if (str === 'login') {
//     Osubject = `Important!!!`
//     Ohtml = `
//         <h1>Urgent Attention Required</h1>
//         <br/>
//         Someone has logged in to your Cyber Levels account if it was not you please change your password ASAP!!!.
//     `
//   } else if (str === 'candidateSignupEmail') {
//     Osubject = `Thank you for signing up ${data.name}`
//     Ohtml = `<h1>Welcome to Cyber Levels</h1>
//     Hope you have a good time getting recruited!
//     <br/>
//     Here are your details-
//     <br/>
//     Name - ${data.name}
//     <br/>
//     Email- ${data.email}`
//   } else if (str === `employerSignupEmail`) {
//     Osubject = `Thank you for signing up ${data.name}`
//     Ohtml = `<h1>Welcome to Cyber Levels</h1>
//     you will have a good time recruiting!!!
//     <br/>
//     your details:
//     Email- ${data.email}`
//   }

//   let info = await transporter.sendMail({
//     from: '"Rituj Manware 🆒" <manwarerutuj@gmail.com>', // sender address <${userObj.email}>
//     to: data.email, // list of receivers
//     subject: Osubject, // Subject line
//     html: Ohtml, // html body
//   });

//   console.log('Message sent: %s', info.messageId);
// };
