import { BrevoClient } from "@getbrevo/brevo";

import verificationEmailTemplate from "../templates/verification-email.template.js";
import welcomeEmailTemplate from "../templates/welcome-email.template.js";

const brevoClient = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendVerificationEmail = async ({
  to,
  fullName,
  verificationUrl,
}) => {
  await brevoClient.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: to,
      },
    ],
    subject: "Verify your Nexora account",
    htmlContent: verificationEmailTemplate({
      fullName,
      verificationUrl,
    }),
  });
};

export const sendWelcomeEmail = async ({ to, fullName }) => {
  await brevoClient.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: to,
      },
    ],
    subject: "Welcome to Nexora 🎉",
    htmlContent: welcomeEmailTemplate({
      fullName,
    }),
  });
};
