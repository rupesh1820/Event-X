import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sentOtpEmail = async(email, otp)=>{
  await transporter.sendMail({
    from: `"EventX <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Event Signup Otp",
    html: `<div style="font-family: arial; padding:20px;">
     <h2>EventX Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `
  });
};