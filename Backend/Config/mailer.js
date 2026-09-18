import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import nodemailer from "nodemailer";

// ========================================
// FORCE IPv4
// ========================================

dns.setDefaultResultOrder("ipv4first");

// ========================================
// __dirname setup
// ========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// Load Backend/.env
// ========================================

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// ========================================
// Check Environment Variables
// ========================================

console.log(
  "EMAIL_USER loaded:",
  !!process.env.EMAIL_USER
);

console.log(
  "EMAIL_PASS loaded:",
  !!process.env.EMAIL_PASS
);

if (
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS
) {
  throw new Error(
    "EMAIL_USER ya EMAIL_PASS .env file me missing hai"
  );
}

// ========================================
// Gmail SMTP Transporter
// ========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  // Gmail SMTP SSL
  port: 465,

  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // Timeout settings
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
});

// ========================================
// Check SMTP Connection
// ========================================

transporter.verify((error, success) => {
  if (error) {
    console.error(
      "Gmail SMTP connection failed:"
    );

    console.error(error);
  } else {
    console.log(
      "Gmail SMTP connection successful"
    );
  }
});

// ========================================
// Send OTP Email
// ========================================

export const sendOtpEmail = async (
  email,
  otp,
  purpose = "verification"
) => {
  try {
    console.log(
      `Sending OTP to: ${email}`
    );

    console.log(
      `OTP generated: ${otp}`
    );

    // ========================================
    // Email Subject
    // ========================================

    const subject =
      purpose === "password-reset"
        ? "EventX Password Reset OTP"
        : "EventX Verification OTP";

    // ========================================
    // Send Email
    // ========================================

    const info = await transporter.sendMail({
      from: `"EventX" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: subject,

      // ======================================
      // Plain Text
      // ======================================

      text: `
Your EventX OTP is ${otp}.

This OTP is valid for 10 minutes.

If you did not request this OTP, please ignore this email.
      `,

      // ======================================
      // HTML Email
      // ======================================

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 30px auto;
          padding: 30px;
          background: #080711;
          color: white;
          border-radius: 16px;
        ">

          <h1 style="
            color: #8b5cf6;
            margin-bottom: 20px;
          ">
            EventX
          </h1>

          <h2>
            ${
              purpose === "password-reset"
                ? "Password Reset"
                : "Email Verification"
            }
          </h2>

          <p style="
            color: #cccccc;
          ">
            Your EventX verification OTP is:
          </p>

          <div style="
            margin: 25px 0;
            padding: 15px;
            background: #17112b;
            border-radius: 10px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #8b5cf6;
          ">
            ${otp}
          </div>

          <p style="
            color: #aaaaaa;
          ">
            This OTP is valid for 10 minutes.
          </p>

          <p style="
            color: #777777;
            font-size: 13px;
          ">
            If you did not request this OTP,
            you can safely ignore this email.
          </p>

        </div>
      `,
    });

    // ========================================
    // Success Logs
    // ========================================

    console.log(
      "OTP email sent successfully"
    );

    console.log(
      "Message ID:",
      info.messageId
    );

    console.log(
      "Accepted:",
      info.accepted
    );

    console.log(
      "Rejected:",
      info.rejected
    );

    return info;

  } catch (error) {
    // ========================================
    // Error Logs
    // ========================================

    console.error(
      "OTP email error:"
    );

    console.error(
      error
    );

    throw error;
  }
};

export default transporter;