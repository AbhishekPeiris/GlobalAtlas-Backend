const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  const message = {
    from: `"Country API" <${process.env.MAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};
