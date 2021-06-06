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