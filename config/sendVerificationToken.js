const nodemailer = require('nodemailer');
const config  = require('@config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'theArkein.dev@gmail.com',
    pass: 'LetmeIn#100'
  }
});

const sendOTP = (mail, token)=>{
    var mailOptions = {
        from: 'theArkein.dev@gmail.com',
        to: mail,
        subject: 'Activate your Haatbazaar account',
        text: `Please follow this link to activate your account. ${process.env.HOSTNAME}${config.base}/user/account/verify/?token=${token} , this link will expire in 5 mins after it is generated.`
      };

    transporter.sendMail(mailOptions).then(info=>{
      console.log(info)
    }).catch(err=>console.log(err))
}

module.exports = sendOTP