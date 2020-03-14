const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const { readFile } = require('../../utils/fileSystem');

const { log, error } = console;

// https://app.sendgrid.com/ configuration
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS
  }
});

// https://mailtrap.io/ configuration
// can use https://mailsac.com/ for testing purpose
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

if (process.env.NODE_ENV !== 'production')
  transporter.verify(function(err) {
    if (error) {
      error('SMTP server connection failed\n', err);
    } else {
      log('SMTP server connection established successfully');
    }
  });

module.exports.mailPasswordRestToken = async (user, resetURL) => {
  const source = await readFile('/services/Mail/view/resetPassword.hbs');
  const template = Handlebars.compile(source.toString());
  const name = user.name.split(' ')[0];
  const html = template({ name, resetURL });

  const mailOptions = {
    from: 'FreeCodeCamp Haifa <noreplay@freecodecamp.com>',
    to: user.email,
    subject: 'Your password reset token (valid for 10 min)',
    text: `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`,
    html
  };

  await transporter.sendMail(mailOptions);
};
