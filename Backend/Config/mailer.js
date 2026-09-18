import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

// ========================================
// Path setup
// ========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// Load .env
// ========================================

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// ========================================
// Check API Key
// ========================================

console.log(
  "RESEND_API_KEY loaded:",
  !!process.env.RESEND_API_KEY
);

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "RESEND_API_KEY .env / Render Environment Variables me missing hai"
  );
}

// ========================================
// Resend
// ========================================

const resend = new Resend(
  process.env.RESEND_API_KEY
);

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
      "========================================"
    );

    console.log(
      "Sending OTP to:",
      email
    );

    console.log(
      "OTP generated:",
      otp
    );

    // ======================================
    // Subject
    // ======================================

    const subject =
      purpose === "password-reset"
        ? "EventX Password Reset OTP"
        : "EventX Verification OTP";

    // ======================================
    // Heading
    // ======================================

    const heading =
      purpose === "password-reset"
        ? "Password Reset"
        : "Email Verification";

    // ======================================
    // Send Email
    // ======================================

    const { data, error } =
      await resend.emails.send({
        from: "EventX <onboarding@resend.dev>",

        to: [email],

        subject: subject,

        text: `
Your EventX OTP is ${otp}.

This OTP is valid for 10 minutes.

If you did not request this OTP, please ignore this email.
        `,

        html: `
<!DOCTYPE html>

<html>

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${subject}</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background: #050505;
    font-family: Arial, Helvetica, sans-serif;
  "
>

  <div
    style="
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
    "
  >

    <div
      style="
        background: #080711;
        color: #ffffff;
        border-radius: 16px;
        padding: 35px;
        border: 1px solid #222;
      "
    >

      <h1
        style="
          margin: 0 0 25px 0;
          color: #8b5cf6;
          font-size: 32px;
        "
      >
        EventX
      </h1>

      <h2
        style="
          color: #ffffff;
          margin-bottom: 15px;
        "
      >
        ${heading}
      </h2>

      <p
        style="
          color: #cccccc;
          font-size: 16px;
          line-height: 1.6;
        "
      >
        Your EventX verification OTP is:
      </p>

      <div
        style="
          margin: 30px 0;
          padding: 20px;
          background: #17112b;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #2d2050;
        "
      >

        <span
          style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 10px;
            color: #8b5cf6;
          "
        >
          ${otp}
        </span>

      </div>

      <p
        style="
          color: #aaaaaa;
          font-size: 14px;
        "
      >
        This OTP is valid for
        <strong style="color: #ffffff;">
          10 minutes
        </strong>.
      </p>

      <p
        style="
          color: #777777;
          font-size: 13px;
          margin-top: 25px;
        "
      >
        If you did not request this OTP,
        you can safely ignore this email.
      </p>

      <div
        style="
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #222;
        "
      >

        <p
          style="
            margin: 0;
            color: #666666;
            font-size: 12px;
          "
        >
          This is an automated email from EventX.
        </p>

      </div>

    </div>

  </div>

</body>

</html>
        `,
      });

    // ======================================
    // Resend Error
    // ======================================

    if (error) {
      console.error(
        "Resend email error:"
      );

      console.error(error);

      throw new Error(
        error.message || "Unable to send OTP"
      );
    }

    // ======================================
    // Success
    // ======================================

    console.log(
      "OTP email sent successfully"
    );

    console.log(
      "Resend Email ID:",
      data?.id
    );

    console.log(
      "========================================"
    );

    return data;

  } catch (error) {
    console.error(
      "OTP email error:",
      error.message
    );

    throw error;
  }
};