const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER_HOST,
  port: process.env.MAIL_SERVER_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_SERVER_USERNAME,
    pass: process.env.MAIL_SERVER_PASSWORD,
  },
});

const send = (to, subject, content) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.MAIL_SERVER_USERNAME,
      to,
      subject,
      html: content,
    };
    console.log('sending')
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

module.exports = {
  send,
};