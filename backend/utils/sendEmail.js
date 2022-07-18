const nodeMailer = require('nodemailer')

const sendEmail = async(options)=>{

        const transporter =  nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        // secure: true,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_EMAIL,
            pass:process.env.SMPT_PASSWORD
        },
        // secureConnection: false,
        // tls: { ciphers: 'SSLv3' }
    });
        const mailOptions = {
            from:process.env.SMPT_EMAIL,
            to:options.email,
            subject:options.subject,
            text:options.message,
        };
        
        await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;
