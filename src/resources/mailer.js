const {Resend} = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY);

const send = async (to, subject, content) => {
  try {
    const r = await resend.emails.send({
      from: 'Cyclo <noreply@cyclo.dev>',
      to: [to],
      subject,
      html: content,
    });
    // log sent email
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  send,
};