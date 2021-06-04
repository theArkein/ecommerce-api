const nodemailer = require('nodemailer');
const config  = require('@config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cloudpasal@gmail.com',
    pass: 'lightwebgroup.com1000'
  }
});

const sendEmail = (subject, message, mail)=>{
      var mailOptions = {
        from: 'cloudpasal@gmail.com',
        to: mail,
        subject,
        text: message
      };

    transporter.sendMail(mailOptions).then(info=>{
      console.log(info)
    }).catch(err=>console.log(err))
}

module.exports = sendEmail