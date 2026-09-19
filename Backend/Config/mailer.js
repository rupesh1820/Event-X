import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendOtpEmail = async (email, otp) => {
  try {
    const response =
      await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "EventX",
        },

        to: [
          {
            email: email,
          },
        ],

        subject: "EventX OTP Verification",

        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>EventX Email Verification</h2>

            <p>Your OTP is:</p>

            <h1 style="letter-spacing: 5px;">
              ${otp}
            </h1>

            <p>This OTP is valid for 10 minutes.</p>

            <p>
              If you did not request this OTP, please ignore this email.
            </p>
          </div>
        `,
      });

    console.log("OTP email sent successfully");

    return response;
  } catch (error) {
    console.error("Brevo OTP email error:", error);
    throw error;
  }
};