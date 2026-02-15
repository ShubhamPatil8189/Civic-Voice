const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Mail options
        const mailOptions = {
            from: `"CivicAssist" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

module.exports = sendEmail;