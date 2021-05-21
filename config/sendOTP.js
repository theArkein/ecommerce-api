const nodemailer = require('nodemailer');
const config  = require('@config/config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'theArkein.dev@gmail.com',
    pass: 'LetmeIn#100'
  }
});

const sendOTP = (mail, otp)=>{
    var mailOptions = {
        from: 'leosarad100@gmial.com',
        to: mail,
        subject: 'Password reset otp for travel right',
        text: `Your OTP is ${otp}. This OTP will expire in 5 mins after it is generated.`
      };

    transporter.sendMail(mailOptions).then(info=>{
      console.log(info)
    }).catch(err=>console.log(err))
}

module.exports = sendOTP