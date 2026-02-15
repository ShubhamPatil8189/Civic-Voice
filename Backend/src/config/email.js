const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTPEmail = async (email, otp, name) => {
  await transporter.sendMail({
    from: `"Civic Voice Interface" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: `
      <h3>Hello ${name},</h3>
      <p>Your OTP for email verification is:</p>
      <h2>${otp}</h2>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};
