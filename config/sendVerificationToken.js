const nodemailer = require('nodemailer');
const config  = require('@config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cloudpasal@gmail.com',
    pass: 'lightwebgroup.com1000'
  }
});

const sendOTP = (userType, mail, token)=>{
    let text = ""
    if(userType === 3)
      text = `Please follow this link to activate your account. ${process.env.HOST}${config.base}/user/account/verify/?token=${token} , this link will expire in 5 mins after it is generated.`
    if(userType === 2)
      text = `Please follow this link to activate your account. ${process.env.HOST}${config.base}/vendor/account/verify/?token=${token} , this link will expire in 5 mins after it is generated.`
    
      var mailOptions = {
        from: 'cloudpasal@gmail.com',
        to: mail,
        subject: 'Activate your Haatbazaar account',
        text
      };

    transporter.sendMail(mailOptions).then(info=>{
      console.log(info)
    }).catch(err=>console.log(err))
}

module.exports = sendOTP