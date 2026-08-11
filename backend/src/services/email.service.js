import { Resend } from "resend";

import verificationEmailTemplate from "../templates/verification-email.template.js";
import welcomeEmailTemplate from "../templates/welcome-email.template.js";

// console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  to,
  fullName,
  verificationUrl,
}) => {
  await resend.emails.send({
    from: process.env.MAIL_FROM,
    to,
    subject: "Verify your Nexora account",
    html: verificationEmailTemplate({
      fullName,
      verificationUrl,
    }),
  });
};

export const sendWelcomeEmail = async ({ to, fullName }) => {
  await resend.emails.send({
    from: process.env.MAIL_FROM,
    to,
    subject: "Welcome to Nexora 🎉",
    html: welcomeEmailTemplate({
      fullName,
    }),
  });
};
