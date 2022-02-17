const nodemailer = require("nodemailer");

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    html: options.text,
  });
};

module.exports = sendEmail;
