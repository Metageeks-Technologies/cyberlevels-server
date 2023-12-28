
// your nodemailer setup file
import nodemailer from 'nodemailer';
import { getSmtpConfigFromDB } from '../services/smtpConfigService';

export const sendMail = async function sendMail(str: string, data: any): Promise<void> {
  try {
    const smtpConfig = await getSmtpConfigFromDB();
    console.log(smtpConfig);
    if (smtpConfig) {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
          user: process.env.NODEMAILER_EMAIL!,
          pass: process.env.NOMEMAILER_PASSWORD!,
        },
      });


      let Osubject: string = '', Ohtml: string = '';

      if (str === 'candidateSignup') {
        Osubject = `Thank you for signing up ${data.firstName}`;
        Ohtml = `
      <h1>Welcome to Cyber Levels</h1>
      Hope you have a good time getting recruited!
      <br/>
      Here are your details-
      <br/>
      Name - ${data.firstName} - ${data.lastName}
      <br/>
      Email- ${data.email}
      `;
      } else if (str === 'employerSignup') {
        Osubject = `Thankyou for signing up ${data.firstName}`;
        Ohtml = `
      <h1>Welcome to Cyber Levels</h1>
      you will have a good time recruiting!!!
      <br/>
      your details:
      Email- ${data.email}
      `;
      } else if (str === 'login') {
        Osubject = `Important!!!`
        Ohtml = `
          <h1>Urgent Attention Required</h1>
          <br/>
          Someone has logged in to your Cyber Levels account if it was not you please change your password ASAP!!!.
      `
      } else if (str === 'candidateSignupEmail') {
        Osubject = `Thank you for signing up ${data.name}`
        Ohtml = `<h1>Welcome to Cyber Levels</h1>
      Hope you have a good time getting recruited!
      <br/>
      Here are your details-
      <br/>
      Name - ${data.name}
      <br/>
      Email- ${data.email}`
      } else if (str === `employerSignupEmail`) {
        Osubject = `Thank you for signing up ${data.name}`
        Ohtml = `<h1>Welcome to Cyber Levels</h1>
      you will have a good time recruiting!!!
      <br/>
      your details:
      Email- ${data.email}`
      } else if (str === `paymentSuccess`) {
        Osubject = `Dear ${data.userName} ,You have successfully purchased the ${data.productName} plan`
        Ohtml = `<h1>You have purchased our plan ${data.productName} of amount ${data.amount} </h1>
    Hope we provide you with the best services!!!
    <br/>
    your details:
    Email- ${data.email}`
      }

      let info = await transporter.sendMail({
        from: '"Rituj Manware 🆒" <manwarerutuj@gmail.com>', // sender address <${userObj.email}>
        to: data.email, // list of receivers
        subject: Osubject, // Subject line
        html: Ohtml, // html body
      });

      console.log('Message sent: %s', info.messageId);

      // ... rest of your nodemailer logic
    } else {
      console.error('SMTP configuration not found in the database.');
    }


  }
  catch (error) {
    console.error('Error creating nodemailer transporter:', error);
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
