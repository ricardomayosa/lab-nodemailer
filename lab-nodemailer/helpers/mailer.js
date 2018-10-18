const nodemailer = require('nodemailer');
const hbs = require('hbs');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS 
    }
});

// const generateHtml = (filename, options={}) => {
//   const html = hbs.compile(fs.readFileSync((__dirname, `./views/mail/${filename}.hbs`), 'utf8'));
//   return html(options);
// };

exports.send = (username, email, hashUser) => {
  //const html = generateHtml(options.filename, options);
  const mailOptions = {
    from    : "rmayo<noreply@rmayo.com>"
    ,to     : email
    ,subject: 'Confirmación de email'
    ,text   : "Haga click en el siguiente enlace para verificar su cuenta: http://localhost:3000/auth/confirm/"
    ,html   : `<p>Hola ${username}. Haga click en el siguiente enlace para verificar su cuenta: http://localhost:3000/auth/confirm/${hashUser}</p>`
  }
  return transporter.sendMail(mailOptions);
};