const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // e.g., your gmail address
      pass: process.env.EMAIL_PASS  // e.g., your gmail app password
    }
  });

  // 2. Define email options
  const mailOptions = {
    from: 'Hari Collection <noreply@haricollection.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
