const nodemailer = require('nodemailer');
const config  = require('@config/config');

let transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SMTP_HOST,
	port: process.env.EMAIL_SMTP_PORT,
	//secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: process.env.EMAIL_SMTP_USERNAME,
		pass: process.env.EMAIL_SMTP_PASSWORD
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