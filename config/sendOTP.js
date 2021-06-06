const nodemailer = require('nodemailer');
const config  = require('@config/config')

let transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SMTP_HOST,
	port: process.env.EMAIL_SMTP_PORT,
	//secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: process.env.EMAIL_SMTP_USERNAME,
		pass: process.env.EMAIL_SMTP_PASSWORD
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