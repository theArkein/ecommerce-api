const nodemailer = require('nodemailer');
const config  = require('@config/config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cloudpasal@gmail.com',
    pass: 'lightwebgroup.com1000'
  }
});

const sendOTP = (mail, otp)=>{
    var mailOptions = {
        from: 'cloudpasal@gmail.com',
        to: mail,
        subject: 'Password reset otp for travel right',
        text: `Your OTP is ${otp}. This OTP will expire in 5 mins after it is generated.`
      };

    transporter.sendMail(mailOptions).then(info=>{
      console.log(info)
    }).catch(err=>console.log(err))
}

module.exports = sendOTP